package com.chatflow.infrastructure.id;

import java.lang.management.ManagementFactory;
import java.net.InetAddress;
import java.security.SecureRandom;

/**
 * 雪花 ID 生成器（数据库文档 1.4：主键 BIGINT、趋势递增、含机房位、不用数据库自增）。
 *
 * 64 位布局：
 * 1b 符号位 | 41b 时间戳(ms，自定义纪元) | 5b 数据中心 | 5b 机器 | 12b 序列
 *
 * dataCenterId / workerId 建议由部署环境（K8s StatefulSet 序号 / Nacos 分配）注入，
 * 同一 dataCenterId 内 workerId 不得重复。时钟回拨超过阈值时拒绝发号并抛异常（fail-fast）。
 */
public final class SnowflakeIdGenerator {

    /** 自定义纪元：2026-01-01T00:00:00Z */
    private static final long EPOCH = 1767225600000L;

    private static final long WORKER_ID_BITS = 5L;
    private static final long DATA_CENTER_ID_BITS = 5L;
    private static final long SEQUENCE_BITS = 12L;

    private static final long MAX_WORKER_ID = ~(-1L << WORKER_ID_BITS);
    private static final long MAX_DATA_CENTER_ID = ~(-1L << DATA_CENTER_ID_BITS);

    private static final long WORKER_ID_SHIFT = SEQUENCE_BITS;
    private static final long DATA_CENTER_ID_SHIFT = SEQUENCE_BITS + WORKER_ID_BITS;
    private static final long TIMESTAMP_SHIFT = SEQUENCE_BITS + WORKER_ID_BITS + DATA_CENTER_ID_BITS;
    private static final long SEQUENCE_MASK = ~(-1L << SEQUENCE_BITS);

    private static final long MAX_BACKWARD_MS = 2L;

    private final long dataCenterId;
    private final long workerId;

    private long lastTimestamp = -1L;
    private long sequence = 0L;

    public SnowflakeIdGenerator(long dataCenterId, long workerId) {
        if (dataCenterId < 0 || dataCenterId > MAX_DATA_CENTER_ID) {
            throw new IllegalArgumentException("dataCenterId 越界: " + dataCenterId);
        }
        if (workerId < 0 || workerId > MAX_WORKER_ID) {
            throw new IllegalArgumentException("workerId 越界: " + workerId);
        }
        this.dataCenterId = dataCenterId;
        this.workerId = workerId;
    }

    /** 本地开发兜底：取 PID 与本机地址派生，降低（不消除）重复概率 */
    public static SnowflakeIdGenerator local() {
        long pid = ProcessHandle.current().pid() & MAX_WORKER_ID;
        long dc;
        try {
            dc = InetAddress.getLocalHost().getHostName().hashCode() & MAX_DATA_CENTER_ID;
        } catch (Exception e) {
            dc = new SecureRandom().nextLong() & MAX_DATA_CENTER_ID;
        }
        return new SnowflakeIdGenerator(dc, pid);
    }

    /** 阻塞式生成：同一毫秒内序列耗尽时自旋到下一毫秒 */
    public synchronized long nextId() {
        long now = System.currentTimeMillis();

        if (now < lastTimestamp) {
            long backward = lastTimestamp - now;
            if (backward <= MAX_BACKWARD_MS) {
                // 小幅回拨：等待追平
                now = lastTimestamp;
            } else {
                throw new IllegalStateException("时钟回拨过大，拒绝发号: " + backward + "ms");
            }
        }

        if (now == lastTimestamp) {
            sequence = (sequence + 1) & SEQUENCE_MASK;
            if (sequence == 0) {
                now = tilNextMillis(lastTimestamp);
            }
        } else {
            sequence = 0L;
        }

        lastTimestamp = now;

        return ((now - EPOCH) << TIMESTAMP_SHIFT)
                | (dataCenterId << DATA_CENTER_ID_SHIFT)
                | (workerId << WORKER_ID_SHIFT)
                | sequence;
    }

    private long tilNextMillis(long lastTs) {
        long ts = System.currentTimeMillis();
        while (ts <= lastTs) {
            ts = System.currentTimeMillis();
        }
        return ts;
    }

    /** 当前 JVM 进程名，便于日志定位（非功能方法） */
    public static String jvmName() {
        return ManagementFactory.getRuntimeMXBean().getName();
    }
}
