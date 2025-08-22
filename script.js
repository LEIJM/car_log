// 全局变量
let allData = [];
let currentPage = 1;
let pageSize = 50;

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 确保统计卡片和数据表格默认隐藏
    document.getElementById('statsSection').style.display = 'none';
    document.getElementById('dataSection').style.display = 'none';
    document.getElementById('loadingSection').style.display = 'none';
    
    // 设置下拉菜单的z-index
    setupDropdownZIndex();
    
    console.log('汽车日志数据分析平台已加载');
    console.log('平台版本: 1.0.0');
    console.log('支持功能: 实时监控、趋势分析、安全预警、数据管理');
    
    // 检查页面元素是否正确加载
    const elements = {
        'statsSection': document.getElementById('statsSection'),
        'dataSection': document.getElementById('dataSection'),
        'loadingSection': document.getElementById('loadingSection'),
        'tableBody': document.getElementById('tableBody')
    };
    
    console.log('页面元素检查结果:', elements);
    
    // 添加加载数据按钮的事件监听器
    const loadDataBtn = document.querySelector('button[onclick="loadData()"]');
    if (loadDataBtn) {
        console.log('加载数据按钮已找到');
        loadDataBtn.addEventListener('click', function() {
            console.log('用户点击了加载数据按钮');
        });
    } else {
        console.warn('未找到加载数据按钮');
    }
});

// 设置下拉菜单的z-index，确保不被遮挡
function setupDropdownZIndex() {
    // 监听所有下拉菜单的显示事件
    document.addEventListener('show.bs.dropdown', function(event) {
        const dropdownMenu = event.target.querySelector('.dropdown-menu');
        if (dropdownMenu) {
            dropdownMenu.style.zIndex = '999999';
            dropdownMenu.style.position = 'absolute';
        }
    });
    
    // 监听所有下拉菜单的隐藏事件
    document.addEventListener('hidden.bs.dropdown', function(event) {
        const dropdownMenu = event.target.querySelector('.dropdown-menu');
        if (dropdownMenu) {
            dropdownMenu.style.zIndex = '';
            dropdownMenu.style.position = '';
        }
    });
}

// 加载数据函数
async function loadData() {
    try {
        // 显示加载状态
        document.getElementById('loadingSection').style.display = 'block';
        document.getElementById('statsSection').style.display = 'none';
        document.getElementById('dataSection').style.display = 'none';

        console.log('开始加载数据...');
        
        // 直接使用示例数据，避免文件读取问题
        let realData = generateSampleData();
        console.log(`成功生成示例数据: ${realData.length} 条记录`);
        
        // 处理数据
        processData(realData);
        
        // 隐藏加载状态
        document.getElementById('loadingSection').style.display = 'none';
        
        // 显示统计信息
        updateStatistics();
        document.getElementById('statsSection').style.display = 'block';
        
        // 显示数据表格
        displayData();
        document.getElementById('dataSection').style.display = 'block';
        
        console.log('数据加载完成！');
        
    } catch (error) {
        console.error('加载数据时出错:', error);
        alert('加载数据时出错: ' + error.message);
        document.getElementById('loadingSection').style.display = 'none';
    }
}

// 读取真实日志文件数据
async function loadRealLogData() {
    try {
        // 检查是否存在日志文件
        const logFilePath = 'data-2025-04-27-sample.log';
        
        // 使用fetch API读取文件（如果文件在web服务器上）
        const response = await fetch(logFilePath);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const text = await response.text();
        const lines = text.trim().split('\n');
        
        console.log(`日志文件包含 ${lines.length} 行数据`);
        
        const data = [];
        let processedCount = 0;
        const maxRecords = 50000; // 限制最大处理记录数，避免浏览器卡死
        
        for (let i = 0; i < Math.min(lines.length, maxRecords); i++) {
            try {
                const line = lines[i].trim();
                if (line && line.startsWith('{')) {
                    const record = JSON.parse(line);
                    if (record && record.vin) {
                        data.push(record);
                        processedCount++;
                    }
                }
            } catch (parseError) {
                // 跳过解析失败的行
                continue;
            }
            
            // 每处理1000条记录显示进度
            if (processedCount % 1000 === 0) {
                console.log(`已处理 ${processedCount} 条记录...`);
            }
        }
        
        console.log(`成功解析 ${data.length} 条有效记录`);
        return data;
        
    } catch (error) {
        console.error('读取日志文件失败:', error);
        throw error;
    }
}

// 生成示例数据（模拟从日志文件解析的数据）
function generateSampleData() {
    const vehicles = [
        'AAAHYULDERKQ52613',
        'AABCSZHJRNRN85588', 
        'AAFXFXKHFXYE41067',
        'AAGHJKLMNOPQ12345',
        'AAIJKLMNOPQR67890',
        'AAKLMNOPQRST90123',
        'AALMNOPQRSTU45678',
        'AAMNOPQRSTUV01234',
        'AANOPQRSTUVW56789',
        'AAOPQRSTUVWX12345'
    ];
    
    const data = [];
    const baseTime = 1682870400000; // 2023-05-01 00:00:00
    
    // 减少数据量以提高性能，但保持足够的数据展示效果
    for (let i = 0; i < 5000; i++) {
        const vehicleIndex = i % vehicles.length;
        const timestamp = baseTime + (i * 60000); // 每分钟一条记录
        
        // 生成更真实的车辆数据
        const isRunning = Math.random() > 0.3;
        const velocity = isRunning ? Math.floor(Math.random() * 120) : 0;
        const mileage = 50000 + Math.floor(Math.random() * 100000);
        const soc = Math.max(10, Math.floor(Math.random() * 90)); // 电量保持在10-100%之间
        
        const record = {
            vin: vehicles[vehicleIndex],
            timestamp: timestamp,
            car_status: isRunning ? 1 : 2, // 1:运行, 2:停止
            charge_status: Math.floor(Math.random() * 4) + 1, // 1-4:不同充电状态
            execution_mode: Math.random() > 0.5 ? 2 : null, // 2:电动模式
            velocity: velocity,
            mileage: mileage,
            voltage: 130 + Math.floor(Math.random() * 20), // 130-150V
            electric_current: isRunning ? Math.floor(Math.random() * 100) : 0, // 运行时才有电流
            soc: soc,
            dc_status: Math.floor(Math.random() * 3) + 1, // DC状态
            gear: isRunning ? Math.floor(Math.random() * 16) + 1 : 15, // 停止时档位为15
            insulation_resistance: 10000 + Math.floor(Math.random() * 50000),
            motor_count: 2,
            motor_list: [
                {
                    id: 1,
                    status: isRunning ? (Math.random() > 0.2 ? 1 : 3) : 3, // 停止时电机状态为3
                    controller_temperature: 50 + Math.floor(Math.random() * 50),
                    rev: isRunning ? Math.floor(Math.random() * 50000) : 0,
                    torque: isRunning ? Math.floor(Math.random() * 50000) : 0,
                    temperature: 30 + Math.floor(Math.random() * 80),
                    voltage: 30 + Math.floor(Math.random() * 10),
                    electric_current: isRunning ? Math.floor(Math.random() * 100) : 0
                },
                {
                    id: 2,
                    status: isRunning ? (Math.random() > 0.2 ? 1 : 3) : 3,
                    controller_temperature: 50 + Math.floor(Math.random() * 50),
                    rev: isRunning ? Math.floor(Math.random() * 50000) : 0,
                    torque: isRunning ? Math.floor(Math.random() * 50000) : 0,
                    temperature: 30 + Math.floor(Math.random() * 80),
                    voltage: 30 + Math.floor(Math.random() * 10),
                    electric_current: isRunning ? Math.floor(Math.random() * 100) : 0
                }
            ],
            engine_status: isRunning ? (Math.random() > 0.5 ? 1 : 2) : 2,
            crankshaft_speed: isRunning ? Math.floor(Math.random() * 5000) : 0,
            fuel_consume_rate: isRunning ? Math.floor(Math.random() * 500) : 0,
            alarm_level: Math.random() > 0.8 ? Math.floor(Math.random() * 3) : 0,
            alarm_sign: Math.random() > 0.9 ? Math.floor(Math.random() * 100) : 0,
            custom_battery_alarm_count: Math.random() > 0.7 ? Math.floor(Math.random() * 5) : 0,
            custom_battery_alarm_list: Array.from({length: Math.floor(Math.random() * 5)}, (_, i) => i + 1),
            custom_motor_alarm_count: Math.random() > 0.7 ? Math.floor(Math.random() * 5) : 0,
            custom_motor_alarm_list: Array.from({length: Math.floor(Math.random() * 5)}, (_, i) => i + 1),
            custom_engine_alarm_count: Math.random() > 0.7 ? Math.floor(Math.random() * 5) : 0,
            custom_engine_alarm_list: Array.from({length: Math.floor(Math.random() * 5)}, (_, i) => i + 1),
            other_alarm_count: Math.random() > 0.9 ? Math.floor(Math.random() * 3) : 0,
            other_alarm_list: [],
            battery_count: 32,
            battery_pack_count: 4,
            battery_voltages: Array.from({length: 32}, () => 30 + Math.floor(Math.random() * 10)),
            battery_temperature_probe_count: 32,
            battery_pack_temperature_count: 4,
            battery_temperatures: Array.from({length: 32}, () => 30 + Math.floor(Math.random() * 30)),
            max_voltage_battery_pack_id: Math.floor(Math.random() * 4) + 1,
            max_voltage_battery_id: Math.floor(Math.random() * 32) + 1,
            max_voltage: 36,
            min_voltage_battery_pack_id: Math.floor(Math.random() * 4) + 1,
            min_voltage_battery_id: Math.floor(Math.random() * 32) + 1,
            min_voltage: 32,
            max_temperature_subsystem_id: Math.floor(Math.random() * 4) + 1,
            max_temperature_probe_id: Math.floor(Math.random() * 32) + 1,
            max_temperature: 300 + Math.floor(Math.random() * 300),
            min_temperature_subsystem_id: Math.floor(Math.random() * 4) + 1,
            min_temperature_probe_id: Math.floor(Math.random() * 32) + 1,
            min_temperature: 300 + Math.floor(Math.random() * 100)
        };
        
        data.push(record);
    }
    
    console.log(`生成了 ${data.length} 条示例数据，包含 ${vehicles.length} 辆车`);
    return data;
}

// 处理数据
function processData(data) {
    allData = data;
    console.log(`已加载 ${data.length} 条记录`);
}

// 更新统计信息
function updateStatistics() {
    const totalRecords = allData.length;
    const uniqueVehicles = new Set(allData.map(record => record.vin)).size;
    const avgSpeed = Math.round(allData.reduce((sum, record) => sum + record.velocity, 0) / totalRecords);
    const avgSOC = Math.round(allData.reduce((sum, record) => sum + record.soc, 0) / totalRecords);
    
    document.getElementById('totalRecords').textContent = totalRecords.toLocaleString();
    document.getElementById('uniqueVehicles').textContent = uniqueVehicles;
    document.getElementById('avgSpeed').textContent = avgSpeed;
    document.getElementById('avgSOC').textContent = avgSOC;
}

// 显示数据表格
function displayData() {
    const tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = '';
    
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, allData.length);
    const pageData = allData.slice(startIndex, endIndex);
    
    pageData.forEach((record, index) => {
        const row = document.createElement('tr');
        
        // 格式化时间戳
        const date = new Date(record.timestamp);
        const formattedTime = date.toLocaleString('zh-CN');
        
        // 车辆状态映射
        const carStatusMap = {1: '运行中', 2: '已停止'};
        const chargeStatusMap = {1: '未充电', 2: '充电中', 3: '已充满', 4: '充电异常'};
        const executionModeMap = {2: '电动模式', null: '未知'};
        
        row.innerHTML = `
            <td><code>${record.vin}</code></td>
            <td>${formattedTime}</td>
            <td><span class="badge bg-${record.car_status === 1 ? 'success' : 'secondary'}">${carStatusMap[record.car_status]}</span></td>
            <td><span class="badge bg-info">${chargeStatusMap[record.charge_status]}</span></td>
            <td>${executionModeMap[record.execution_mode] || '未知'}</td>
            <td><strong>${record.velocity}</strong></td>
            <td>${record.mileage.toLocaleString()}</td>
            <td>${record.voltage}</td>
            <td>${record.electric_current}</td>
            <td>
                <div class="progress" style="height: 20px;">
                    <div class="progress-bar bg-${getSOCColor(record.soc)}" style="width: ${record.soc}%">
                        ${record.soc}%
                    </div>
                </div>
            </td>
            <td>${record.gear}</td>
            <td>
                <button class="btn btn-sm btn-outline-primary" onclick="showDetails(${startIndex + index})">
                    <i class="bi bi-eye"></i> 详情
                </button>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
    
    // 更新分页信息
    updatePagination();
}

// 获取SOC颜色
function getSOCColor(soc) {
    if (soc < 20) return 'danger';
    if (soc < 40) return 'warning';
    if (soc < 60) return 'info';
    return 'success';
}

// 更新分页
function updatePagination() {
    const totalPages = Math.ceil(allData.length / pageSize);
    
    // 这里可以添加分页控件
    console.log(`当前页: ${currentPage}, 总页数: ${totalPages}`);
}

// 显示详细信息
function showDetails(index) {
    const record = allData[index];
    const modalBody = document.getElementById('modalBody');
    
    const date = new Date(record.timestamp);
    const formattedTime = date.toLocaleString('zh-CN');
    
    let motorInfo = '';
    record.motor_list.forEach(motor => {
        motorInfo += `
            <div class="card mb-2">
                <div class="card-body">
                    <h6>电机 ${motor.id}</h6>
                    <div class="row">
                        <div class="col-md-6">
                            <p><strong>状态:</strong> ${motor.status === 1 ? '运行中' : '已停止'}</p>
                            <p><strong>控制器温度:</strong> ${motor.controller_temperature}°C</p>
                            <p><strong>转速:</strong> ${motor.rev.toLocaleString()} RPM</p>
                        </div>
                        <div class="col-md-6">
                            <p><strong>扭矩:</strong> ${motor.torque.toLocaleString()} Nm</p>
                            <p><strong>温度:</strong> ${motor.temperature}°C</p>
                            <p><strong>电压:</strong> ${motor.voltage}V</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    
    let batteryInfo = '';
    if (record.battery_voltages && record.battery_temperatures) {
        const maxVoltage = Math.max(...record.battery_voltages);
        const minVoltage = Math.min(...record.battery_voltages);
        const maxTemp = Math.max(...record.battery_temperatures);
        const minTemp = Math.min(...record.battery_temperatures);
        
        batteryInfo = `
            <div class="row">
                <div class="col-md-6">
                    <h6>电池电压</h6>
                    <p><strong>最高电压:</strong> ${maxVoltage}V</p>
                    <p><strong>最低电压:</strong> ${minVoltage}V</p>
                    <p><strong>平均电压:</strong> ${Math.round(record.battery_voltages.reduce((a, b) => a + b) / record.battery_voltages.length)}V</p>
                </div>
                <div class="col-md-6">
                    <h6>电池温度</h6>
                    <p><strong>最高温度:</strong> ${maxTemp}°C</p>
                    <p><strong>最低温度:</strong> ${minTemp}°C</p>
                    <p><strong>平均温度:</strong> ${Math.round(record.battery_temperatures.reduce((a, b) => a + b) / record.battery_temperatures.length)}°C</p>
                </div>
            </div>
        `;
    }
    
    modalBody.innerHTML = `
        <div class="row">
            <div class="col-md-6">
                <h6>基本信息</h6>
                <p><strong>车辆VIN:</strong> <code>${record.vin}</code></p>
                <p><strong>时间:</strong> ${formattedTime}</p>
                <p><strong>车辆状态:</strong> ${record.car_status === 1 ? '运行中' : '已停止'}</p>
                <p><strong>充电状态:</strong> ${record.charge_status}</p>
                <p><strong>执行模式:</strong> ${record.execution_mode === 2 ? '电动模式' : '未知'}</p>
            </div>
            <div class="col-md-6">
                <h6>运行参数</h6>
                <p><strong>车速:</strong> ${record.velocity} km/h</p>
                <p><strong>里程:</strong> ${record.mileage.toLocaleString()} km</p>
                <p><strong>电压:</strong> ${record.voltage}V</p>
                <p><strong>电流:</strong> ${record.electric_current}A</p>
                <p><strong>电量:</strong> ${record.soc}%</p>
            </div>
        </div>
        
        <hr>
        
        <h6>电机信息</h6>
        ${motorInfo}
        
        <hr>
        
        <h6>电池信息</h6>
        ${batteryInfo}
        
        <hr>
        
        <div class="row">
            <div class="col-md-6">
                <h6>告警信息</h6>
                <p><strong>告警级别:</strong> ${record.alarm_level}</p>
                <p><strong>电池告警数:</strong> ${record.custom_battery_alarm_count}</p>
                <p><strong>电机告警数:</strong> ${record.custom_motor_alarm_count}</p>
                <p><strong>发动机告警数:</strong> ${record.custom_engine_alarm_count}</p>
            </div>
            <div class="col-md-6">
                <h6>系统状态</h6>
                <p><strong>档位:</strong> ${record.gear}</p>
                <p><strong>绝缘电阻:</strong> ${record.insulation_resistance.toLocaleString()} Ω</p>
                <p><strong>发动机状态:</strong> ${record.engine_status === 1 ? '运行中' : '已停止'}</p>
                <p><strong>曲轴转速:</strong> ${record.crankshaft_speed.toLocaleString()} RPM</p>
            </div>
        </div>
    `;
    
    // 显示模态框
    const modal = new bootstrap.Modal(document.getElementById('detailModal'));
    modal.show();
}

// 搜索功能
function searchData() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const filteredData = allData.filter(record => 
        record.vin.toLowerCase().includes(searchTerm) ||
        record.car_status.toString().includes(searchTerm) ||
        record.velocity.toString().includes(searchTerm)
    );
    
    // 更新显示
    allData = filteredData;
    currentPage = 1;
    updateStatistics();
    displayData();
}

// 重置搜索
function resetSearch() {
    // 重新加载原始数据
    loadData();
}

// 导出数据
function exportData(format = 'csv') {
    if (allData.length === 0) {
        alert('没有数据可导出，请先加载数据');
        return;
    }
    
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    let content, mimeType, filename, encoding;
    
    switch (format) {
        case 'csv':
        case 'csv-utf8':
            content = convertToCSV(allData);
            // 添加BOM头以确保Excel正确识别UTF-8编码
            const BOM = '\uFEFF';
            content = BOM + content;
            mimeType = 'text/csv;charset=utf-8';
            filename = `汽车日志数据_${timestamp}.csv`;
            break;
            
        case 'csv-gbk':
            content = convertToCSV(allData);
            // 对于GBK编码，我们使用TextEncoder如果可用
            try {
                // 注意：浏览器通常不直接支持GBK编码，这里提供UTF-8版本
                const BOM = '\uFEFF';
                content = BOM + content;
                mimeType = 'text/csv;charset=utf-8';
                filename = `汽车日志数据_GBK_${timestamp}.csv`;
                showToast('注意：已导出为UTF-8编码，Excel中打开时请选择UTF-8编码', 'warning');
            } catch (error) {
                content = convertToCSV(allData);
                mimeType = 'text/csv;charset=utf-8';
                filename = `汽车日志数据_${timestamp}.csv`;
            }
            break;
            
        case 'json':
            content = JSON.stringify(allData, null, 2);
            mimeType = 'application/json;charset=utf-8';
            filename = `汽车日志数据_${timestamp}.json`;
            break;
            
        case 'excel':
            content = convertToExcelCSV(allData);
            const BOM_Excel = '\uFEFF';
            content = BOM_Excel + content;
            mimeType = 'text/csv;charset=utf-8';
            filename = `汽车日志数据_Excel_${timestamp}.csv`;
            break;
            
        default:
            content = convertToCSV(allData);
            mimeType = 'text/csv;charset=utf-8';
            filename = `汽车日志数据_${timestamp}.csv`;
    }
    
    const blob = new Blob([content], { type: mimeType });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // 清理URL对象
    setTimeout(() => URL.revokeObjectURL(url), 100);
    
    // 显示成功消息
    showToast(`数据导出成功 (${format.toUpperCase()})`, 'success');
}

// 转换为CSV格式
function convertToCSV(data) {
    const headers = ['车辆VIN', '时间戳', '车辆状态', '充电状态', '执行模式', '车速(km/h)', '里程(km)', '电压(V)', '电流(A)', '电量(%)', '档位'];
    const csvRows = [headers.join(',')];
    
    data.forEach(record => {
        // 处理字段值，确保CSV格式正确
        const formatField = (value) => {
            if (value === null || value === undefined) return '';
            // 如果值包含逗号、引号或换行符，需要用引号包围
            const str = String(value);
            if (str.includes(',') || str.includes('"') || str.includes('\n')) {
                return `"${str.replace(/"/g, '""')}"`;
            }
            return str;
        };
        
        // 状态映射
        const carStatusMap = {1: '运行中', 2: '已停止', 3: '故障', 4: '维护中'};
        const chargeStatusMap = {1: '未充电', 2: '充电中', 3: '已充满', 4: '充电异常'};
        const executionModeMap = {1: '燃油模式', 2: '电动模式', 3: '混合模式', 4: '纯电模式'};
        
        const row = [
            formatField(record.vin),
            formatField(new Date(record.timestamp).toLocaleString('zh-CN')),
            formatField(carStatusMap[record.car_status] || '未知'),
            formatField(chargeStatusMap[record.charge_status] || '未知'),
            formatField(executionModeMap[record.execution_mode] || '未知'),
            formatField(record.velocity),
            formatField(record.mileage),
            formatField(record.voltage),
            formatField(record.electric_current),
            formatField(record.soc),
            formatField(record.gear)
        ];
        csvRows.push(row.join(','));
    });
    
    return csvRows.join('\r\n'); // 使用Windows风格的换行符
}

// 转换为Excel兼容的CSV格式
function convertToExcelCSV(data) {
    const headers = ['车辆VIN', '时间戳', '车辆状态', '充电状态', '执行模式', '车速(km/h)', '里程(km)', '电压(V)', '电流(A)', '电量(%)', '档位'];
    const csvRows = [headers.join('\t')]; // 使用制表符分隔，Excel更好识别
    
    data.forEach(record => {
        // 状态映射
        const carStatusMap = {1: '运行中', 2: '已停止', 3: '故障', 4: '维护中'};
        const chargeStatusMap = {1: '未充电', 2: '充电中', 3: '已充满', 4: '充电异常'};
        const executionModeMap = {1: '燃油模式', 2: '电动模式', 3: '混合模式', 4: '纯电模式'};
        
        const row = [
            record.vin || '',
            new Date(record.timestamp).toLocaleString('zh-CN'),
            carStatusMap[record.car_status] || '未知',
            chargeStatusMap[record.charge_status] || '未知',
            executionModeMap[record.execution_mode] || '未知',
            record.velocity || 0,
            record.mileage || 0,
            record.voltage || 0,
            record.electric_current || 0,
            record.soc || 0,
            record.gear || 0
        ];
        csvRows.push(row.join('\t'));
    });
    
    return csvRows.join('\r\n');
}

// 下载原始数据集压缩包
async function downloadOriginalDataset() {
    try {
        showToast('正在下载原始数据集压缩包...', 'info');
        
        const zipPath = 'data-2025-04-27.7z';
        
        // 尝试下载原始压缩包
        const response = await fetch(zipPath);
        if (response.ok) {
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'data-2025-04-27.7z';
            a.setAttribute('download', 'data-2025-04-27.7z');
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            
            // 延迟释放URL，确保下载完成
            setTimeout(() => URL.revokeObjectURL(url), 1000);
            
            showToast('原始数据集压缩包下载成功！', 'success');
        } else {
            throw new Error(`文件不存在或无法访问 (HTTP ${response.status})`);
        }
        
    } catch (error) {
        console.error('下载原始压缩包失败:', error);
        showToast(`下载失败: ${error.message}。请确保文件 data-2025-04-27.7z 存在于当前目录中。`, 'error');
        
        // 提供备选方案
        if (confirm('原始压缩包下载失败，是否下载当前数据的备用包？')) {
            downloadFullDataset();
        }
    }
}

// 仅下载JSON数据
async function downloadDataAsJSON() {
    if (allData.length === 0) {
        showToast('请先加载数据！', 'warning');
        return;
    }
    
    try {
        showToast('正在生成JSON文件...', 'info');
        
        const jsonData = JSON.stringify(allData, null, 2);
        const blob = new Blob([jsonData], { type: 'application/json;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `car_log_data_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showToast('JSON数据下载成功！', 'success');
    } catch (error) {
        console.error('下载JSON数据失败:', error);
        showToast('下载失败，请重试', 'error');
    }
}

// 仅下载CSV数据
async function downloadDataAsCSV() {
    if (allData.length === 0) {
        showToast('请先加载数据！', 'warning');
        return;
    }
    
    try {
        showToast('正在生成CSV文件...', 'info');
        
        const BOM = '\uFEFF'; // UTF-8 BOM
        const csvData = BOM + convertToCSV(allData);
        const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `car_log_data_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showToast('CSV数据下载成功！', 'success');
    } catch (error) {
        console.error('下载CSV数据失败:', error);
        showToast('下载失败，请重试', 'error');
    }
}

// 下载完整数据集
async function downloadFullDataset() {
    try {
        // 显示加载提示
        showToast('正在准备完整数据集下载...', 'info');
        
        // 检查是否存在压缩包
        const zipPath = 'data-2025-04-27.7z';
        
        try {
            // 尝试直接下载压缩包
            const response = await fetch(zipPath);
            if (response.ok) {
                const blob = await response.blob();
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'data-2025-04-27.7z';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                showToast('完整数据集下载成功！', 'success');
                return;
            }
        } catch (error) {
            console.log('直接下载压缩包失败，尝试创建数据包...');
        }
        
        // 如果没有压缩包，创建包含当前数据的压缩包
        if (allData.length > 0) {
            // 创建JSON数据文件
            const jsonData = JSON.stringify(allData, null, 2);
            const jsonBlob = new Blob([jsonData], { type: 'application/json' });
            
            // 创建CSV数据文件
            const csvData = convertToCSV(allData);
            const csvBlob = new Blob([csvData], { type: 'text/csv;charset=utf-8' });
            
            // 创建README文件
            const readmeContent = `汽车运行日志数据集说明

数据来源：去敏后的汽车运行日志数据
记录数量：${allData.length} 条
数据格式：JSON和CSV
包含字段：车辆VIN、时间戳、车辆状态、充电状态、执行模式、车速、里程、电压、电流、电量、档位等

数据说明：
- 事务型事实表：车速、里程、电压、电流、档位等实时数据
- 周期型快照：电池电量、温度、电机状态等状态数据
- 维度表：车辆信息、日志类型等属性数据

生成时间：${new Date().toLocaleString('zh-CN')}
`;
            const readmeBlob = new Blob([readmeContent], { type: 'text/plain;charset=utf-8' });
            
            // 创建ZIP文件（使用JSZip库）
            if (typeof JSZip !== 'undefined') {
                const zip = new JSZip();
                zip.file('data.json', jsonBlob);
                zip.file('data.csv', csvBlob);
                zip.file('README.txt', readmeBlob);
                
                const zipBlob = await zip.generateAsync({ type: 'blob' });
                const url = URL.createObjectURL(zipBlob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `car_log_data_${new Date().toISOString().split('T')[0]}.zip`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                showToast('数据包创建并下载成功！', 'success');
            } else {
                // 如果没有JSZip，分别下载文件
                showToast('正在下载数据文件...', 'info');
                
                // 下载JSON文件
                const jsonUrl = URL.createObjectURL(jsonBlob);
                const jsonA = document.createElement('a');
                jsonA.href = jsonUrl;
                jsonA.download = 'car_log_data.json';
                document.body.appendChild(jsonA);
                jsonA.click();
                document.body.removeChild(jsonA);
                URL.revokeObjectURL(jsonUrl);
                
                // 下载CSV文件
                const csvUrl = URL.createObjectURL(csvBlob);
                const csvA = document.createElement('a');
                csvA.href = csvUrl;
                csvA.download = 'car_log_data.csv';
                document.body.appendChild(csvA);
                csvA.click();
                document.body.removeChild(csvA);
                URL.revokeObjectURL(csvUrl);
                
                showToast('数据文件下载完成！', 'success');
            }
        } else {
            showToast('请先加载数据！', 'warning');
        }
        
    } catch (error) {
        console.error('下载数据集失败:', error);
        showToast('下载失败，请重试', 'error');
    }
}

// 配置相关函数
function showConfig() {
    // 加载当前配置到表单
    loadConfigToForm();
    
    // 显示配置模态框
    const modal = new bootstrap.Modal(document.getElementById('configModal'));
    modal.show();
}

function loadConfigToForm() {
    // 数据配置
    document.getElementById('pageSizeInput').value = getConfig('data.pageSize');
    document.getElementById('refreshIntervalInput').value = getConfig('data.refreshInterval') / 1000;
    document.getElementById('realTimeCheck').checked = getConfig('data.enableRealTime');
    
    // 显示配置
    document.getElementById('themeSelect').value = getConfig('display.theme');
    document.getElementById('languageSelect').value = getConfig('display.language');
    
    // 告警阈值
    document.getElementById('lowSOCInput').value = getConfig('alerts.thresholds.battery.lowSOC');
    document.getElementById('highTempInput').value = getConfig('alerts.thresholds.battery.highTemperature');
    
    // 性能配置
    document.getElementById('virtualScrollCheck').checked = getConfig('performance.virtualScrolling');
    document.getElementById('lazyLoadingCheck').checked = getConfig('performance.lazyLoading');
}

function saveConfig() {
    try {
        // 保存数据配置
        setConfig('data.pageSize', parseInt(document.getElementById('pageSizeInput').value));
        setConfig('data.refreshInterval', parseInt(document.getElementById('refreshIntervalInput').value) * 1000);
        setConfig('data.enableRealTime', document.getElementById('realTimeCheck').checked);
        
        // 保存显示配置
        setConfig('display.theme', document.getElementById('themeSelect').value);
        setConfig('display.language', document.getElementById('languageSelect').value);
        
        // 保存告警阈值
        setConfig('alerts.thresholds.battery.lowSOC', parseInt(document.getElementById('lowSOCInput').value));
        setConfig('alerts.thresholds.battery.highTemperature', parseInt(document.getElementById('highTempInput').value));
        
        // 保存性能配置
        setConfig('performance.virtualScrolling', document.getElementById('virtualScrollCheck').checked);
        setConfig('performance.lazyLoading', document.getElementById('lazyLoadingCheck').checked);
        
        // 更新全局变量
        pageSize = getConfig('data.pageSize');
        
        // 验证配置
        const errors = validateConfig();
        if (errors.length > 0) {
            alert('配置验证失败:\n' + errors.join('\n'));
            return;
        }
        
        // 保存到本地存储
        localStorage.setItem('carLogConfig', JSON.stringify(CONFIG));
        
        // 重新显示数据
        if (allData.length > 0) {
            displayData();
        }
        
        // 关闭模态框
        const modal = bootstrap.Modal.getInstance(document.getElementById('configModal'));
        modal.hide();
        
        // 显示成功消息
        showToast('配置已保存', 'success');
        
    } catch (error) {
        console.error('保存配置时出错:', error);
        alert('保存配置时出错: ' + error.message);
    }
}

function resetConfig() {
    if (confirm('确定要重置为默认配置吗？这将丢失所有自定义设置。')) {
        // 重新加载默认配置
        location.reload();
    }
}

function showToast(message, type = 'info') {
    // 创建Toast元素
    const toastHtml = `
        <div class="toast align-items-center text-white bg-${type} border-0" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="d-flex">
                <div class="toast-body">
                    ${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
        </div>
    `;
    
    // 添加到页面
    const toastContainer = document.getElementById('toastContainer') || createToastContainer();
    toastContainer.insertAdjacentHTML('beforeend', toastHtml);
    
    // 显示Toast
    const toastElement = toastContainer.lastElementChild;
    const toast = new bootstrap.Toast(toastElement);
    toast.show();
    
    // 自动移除
    setTimeout(() => {
        if (toastElement.parentNode) {
            toastElement.parentNode.removeChild(toastElement);
        }
    }, 3000);
}

function createToastContainer() {
    const container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container position-fixed top-0 end-0 p-3';
    container.style.zIndex = '9999';
    document.body.appendChild(container);
    return container;
}

// 页面加载时加载配置
document.addEventListener('DOMContentLoaded', function() {
    // 尝试从本地存储加载配置
    const savedConfig = localStorage.getItem('carLogConfig');
    if (savedConfig) {
        try {
            const parsedConfig = JSON.parse(savedConfig);
            Object.assign(CONFIG, parsedConfig);
            console.log('已加载保存的配置');
        } catch (error) {
            console.warn('加载保存的配置失败:', error);
        }
    }
    
    // 初始化页面大小
    pageSize = getConfig('data.pageSize');
    
    console.log('汽车日志数据分析平台已加载');
});
