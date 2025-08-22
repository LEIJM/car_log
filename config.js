// 汽车日志数据分析平台配置文件

const CONFIG = {
    // 平台基本信息
    platform: {
        name: '汽车运行日志数据分析平台',
        version: '1.0.0',
        description: '基于事务型事实表和周期型快照事实表的智能车辆监控系统'
    },

    // 数据配置
    data: {
        // 分页设置
        pageSize: 50,
        maxRecords: 10000,
        
        // 数据刷新间隔（毫秒）
        refreshInterval: 30000,
        
        // 是否启用实时数据更新
        enableRealTime: false,
        
        // 数据源配置
        dataSource: {
            type: 'simulation', // 'simulation' | 'file' | 'api'
            filePath: 'data-2025-04-27/data-2025-04-27-sample.log',
            apiEndpoint: 'http://localhost:3000/api/data'
        }
    },

    // 显示配置
    display: {
        // 主题设置
        theme: 'default', // 'default' | 'dark' | 'light'
        
        // 语言设置
        language: 'zh-CN', // 'zh-CN' | 'en-US'
        
        // 时间格式
        timeFormat: 'YYYY-MM-DD HH:mm:ss',
        
        // 数字格式化
        numberFormat: {
            decimalPlaces: 2,
            useThousandsSeparator: true
        },
        
        // 表格配置
        table: {
            showPagination: true,
            showSearch: true,
            showExport: true,
            sortable: true,
            resizable: true
        }
    },

    // 图表配置
    charts: {
        // 是否启用图表功能
        enabled: true,
        
        // 图表类型
        types: ['line', 'bar', 'pie', 'gauge'],
        
        // 默认图表配置
        default: {
            height: 400,
            width: '100%',
            colors: ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe']
        }
    },

    // 告警配置
    alerts: {
        // 告警阈值设置
        thresholds: {
            battery: {
                lowSOC: 20,
                highTemperature: 60,
                lowVoltage: 30,
                highVoltage: 40
            },
            motor: {
                highTemperature: 100,
                highRev: 50000
            },
            vehicle: {
                maxSpeed: 120,
                maxMileage: 1000000
            }
        },
        
        // 告警通知设置
        notifications: {
            enabled: true,
            sound: true,
            desktop: false,
            email: false
        }
    },

    // 导出配置
    export: {
        // 支持的文件格式
        formats: ['csv', 'json', 'excel'],
        
        // 默认导出格式
        defaultFormat: 'csv',
        
        // 导出文件名模板
        filenameTemplate: '汽车日志数据_{timestamp}',
        
        // 导出数据限制
        maxExportRecords: 10000
    },

    // 性能配置
    performance: {
        // 是否启用虚拟滚动
        virtualScrolling: true,
        
        // 数据缓存大小
        cacheSize: 1000,
        
        // 是否启用懒加载
        lazyLoading: true,
        
        // 数据压缩
        compression: false
    },

    // 安全配置
    security: {
        // 是否启用数据脱敏
        dataMasking: true,
        
        // 敏感字段列表
        sensitiveFields: ['vin', 'gps_coordinates'],
        
        // 访问控制
        accessControl: {
            enabled: false,
            requireAuth: false,
            allowedIPs: []
        }
    },

    // 日志配置
    logging: {
        // 日志级别
        level: 'info', // 'debug' | 'info' | 'warn' | 'error'
        
        // 是否启用控制台日志
        console: true,
        
        // 是否启用文件日志
        file: false,
        
        // 日志文件路径
        logFilePath: './logs/platform.log'
    },

    // 自定义字段映射
    fieldMapping: {
        // 车辆状态映射
        carStatus: {
            1: '运行中',
            2: '已停止',
            3: '故障',
            4: '维护中'
        },
        
        // 充电状态映射
        chargeStatus: {
            1: '未充电',
            2: '充电中',
            3: '已充满',
            4: '充电异常'
        },
        
        // 执行模式映射
        executionMode: {
            1: '燃油模式',
            2: '电动模式',
            3: '混合模式',
            4: '纯电模式'
        }
    },

    // 数据验证规则
    validation: {
        // 数值范围验证
        ranges: {
            velocity: { min: 0, max: 200 },
            soc: { min: 0, max: 100 },
            voltage: { min: 100, max: 200 },
            temperature: { min: -40, max: 100 }
        },
        
        // 必填字段
        required: ['vin', 'timestamp', 'car_status'],
        
        // 字段类型验证
        types: {
            vin: 'string',
            timestamp: 'number',
            velocity: 'number',
            soc: 'number'
        }
    }
};

// 配置验证函数
function validateConfig() {
    const errors = [];
    
    // 检查必要的配置项
    if (!CONFIG.data.pageSize || CONFIG.data.pageSize < 1) {
        errors.push('分页大小必须大于0');
    }
    
    if (!CONFIG.display.language) {
        errors.push('语言设置不能为空');
    }
    
    // 检查告警阈值
    if (CONFIG.alerts.thresholds.battery.lowSOC >= CONFIG.alerts.thresholds.battery.highTemperature) {
        errors.push('电池低电量阈值设置不合理');
    }
    
    return errors;
}

// 配置获取函数
function getConfig(path) {
    return path.split('.').reduce((obj, key) => obj && obj[key], CONFIG);
}

// 配置设置函数
function setConfig(path, value) {
    const keys = path.split('.');
    const lastKey = keys.pop();
    const target = keys.reduce((obj, key) => obj[key] = obj[key] || {}, CONFIG);
    target[lastKey] = value;
}

// 导出配置
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CONFIG, validateConfig, getConfig, setConfig };
} else {
    // 浏览器环境
    window.CONFIG = CONFIG;
    window.validateConfig = validateConfig;
    window.getConfig = getConfig;
    window.setConfig = setConfig;
}
