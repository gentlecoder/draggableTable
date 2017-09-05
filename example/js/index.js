/**
 * Created by 10206072 on 2017/9/4.
 */
$(function () {
    var source = [{
        "id": "1",
        "deviceType": "出口交换机",
        "deviceName": "001",
        "deviceIp": "10.47.202.105",
        "deviceInPort": "80",
        "deviceOutPort": "81",
        "deviceInIp": "1.1.1.1",
        "deviceOutIp": "1.10.101.102"
    }, {
        "id": "2",
        "deviceType": "防火墙",
        "deviceName": "002",
        "deviceIp": "10.47.202.105",
        "deviceInPort": "80",
        "deviceOutPort": "81",
        "deviceInIp": "1.1.1.1",
        "deviceOutIp": "1.10.101.102"
    }, {
        "id": "3",
        "deviceType": "核心交换机",
        "deviceName": "003",
        "deviceIp": "10.47.202.105",
        "deviceInPort": "80",
        "deviceOutPort": "81",
        "deviceInIp": "1.1.1.1",
        "deviceOutIp": "1.10.101.102"
    }, {
        "id": "4",
        "deviceType": "业务交换机",
        "deviceName": "004",
        "deviceIp": "10.47.202.105",
        "deviceInPort": "80",
        "deviceOutPort": "81",
        "deviceInIp": "1.1.1.1",
        "deviceOutIp": "1.10.101.102"
    }, {
        "id": "5",
        "deviceType": "虚拟防火墙",
        "deviceName": "005",
        "deviceIp": "10.47.202.105",
        "deviceInPort": "80",
        "deviceOutPort": "81",
        "deviceInIp": "1.1.1.1",
        "deviceOutIp": "1.10.101.102"
    }, {
        "id": "6",
        "deviceType": "负载均衡器",
        "deviceName": "006",
        "deviceIp": "10.47.202.105",
        "deviceInPort": "80",
        "deviceOutPort": "81",
        "deviceInIp": "1.1.1.1",
        "deviceOutIp": "1.10.101.102"
    }];
    var deviceTypes = [
        {
            "id": 1,
            "deviceName": "出口交换机",
            "deviceParams": "{\"名称\":\"name\",\"IP地址\":\"ip\",\"入端口\":\"inport\",\"出端口\":\"outport\"}"
        },
        {
            "id": 2,
            "deviceName": "防火墙",
            "deviceParams": "{\"名称\":\"name\",\"端口\":\"port\",\"内网IP\":\"inip\",\"外网IP\":\"outip\"}"
        },
        {
            "id": 3,
            "deviceName": "核心交换机",
            "deviceParams": "{\"名称\":\"name\",\"IP地址\":\"ip\",\"入端口\":\"inport\",\"出端口\":\"outport\"}"
        },
        {
            "id": 4,
            "deviceName": "业务交换机",
            "deviceParams": "{\"名称\":\"name\",\"IP地址\":\"ip\",\"入端口\":\"inport\",\"出端口\":\"outport\"}"
        },
        {
            "id": 5,
            "deviceName": "虚拟防火墙",
            "deviceParams": "{\"名称\":\"name\",\"端口\":\"port\",\"内网IP\":\"inip\",\"外网IP\":\"outip\"}"
        },
        {
            "id": 6,
            "deviceName": "LB",
            "deviceParams": "{\"名称\":\"name\",\"浮动IP\":\"floatip\"}"
        },
        {
            "id": 7,
            "deviceName": "存储交换机",
            "deviceParams": "{\"名称\":\"name\",\"IP地址\":\"ip\",\"入端口\":\"inport\",\"出端口\":\"outport\"}"
        }
    ];
    var select = [];
    for (var i = 0; i < deviceTypes.length; i++) {
        var tmp = {};
        tmp.id = deviceTypes[i].id;
        tmp.value = deviceTypes[i].deviceName;
        select[i] = tmp;
    }

    function resetTabullet() {
        $("#table").tabullet({
            data: source,
            select: select,
            deleteContent: '删除',
            editContent: '编辑',
            saveContent: '添加',
            action: function (mode, data) {
                console.dir(mode);
                if (mode === 'save') {
                    source.push(data);
                }
                if (mode === 'edit') {
                    for (var i = 0; i < source.length; i++) {
                        if (source[i].id == data.id) {
                            source[i] = data;
                        }
                    }
                }
                if (mode == 'delete') {
                    for (var i = 0; i < source.length; i++) {
                        if (source[i].id == data) {
                            source.splice(i, 1);
                            break;
                        }
                    }
                }
                resetTabullet();
                $('.sorted_table').sortable("destroy");
                $('.sorted_table').sortable({
                    containerSelector: 'table',
                    itemPath: '> tbody',
                    itemSelector: 'tr[data-tabullet-id!=-1]',
                    placeholder: '<tr class="placeholder"/>',
                    group: 'group',
                    drag: 'false',
                    onDragStart: function ($item, container, _super) {
                        // Duplicate items of the no drop area
                        if (!container.options.drop)
                            $item.clone().insertAfter($item);
                        _super($item, container);
                    },
                    onDrop: function ($item, container, _super, event) {
                        $item.removeClass(container.group.options.draggedClass).removeAttr("style");
                        $("body").removeClass(container.group.options.bodyClass);
                        var sourceID = $item.children().eq(0).text();
                        if ($item[0].nextElementSibling != null) {
                            var targetID = $item[0].nextElementSibling.firstElementChild.textContent - 1;
                        } else {
                            var targetID = source.length - 1;
                        }
                        var tmp = source;
                        source = [];
                        for (var i = 0; i < tmp.length; i++) {
                            if (i < sourceID || i > targetID) {
                                source[i] = tmp[i]
                            } else if (i >= sourceID && i < targetID) {
                                source[i] = tmp[i + 1]
                            } else if (i == targetID) {
                                source[i] = tmp[sourceID]
                            }
                        }
                    }
                });
            }
        });
    }

    resetTabullet();

    $('.sorted_table').sortable({
        containerSelector: 'table',
        itemPath: '> tbody',
        itemSelector: 'tr[data-tabullet-id!=-1]',
        handle: 'td[draggable]',
        placeholder: '<tr class="placeholder"/>',
        group: 'group',
        drag: 'false',
        onDragStart: function ($item, container, _super) {
            // Duplicate items of the no drop area
            if (!container.options.drop)
                $item.clone().insertAfter($item);
            _super($item, container);
        },
        onDrop: function ($item, container, _super, event) {
            $item.removeClass(container.group.options.draggedClass).removeAttr("style");
            $("body").removeClass(container.group.options.bodyClass);
            var sourceID = $item.children().eq(0).text();
            if ($item[0].nextElementSibling != null) {
                var targetID = $item[0].nextElementSibling.firstElementChild.textContent - 1;
            } else {
                var targetID = source.length - 1;
            }
            var tmp = source;
            source = [];
            for (var i = 0; i < tmp.length; i++) {
                if (i < sourceID || i > targetID) {
                    source[i] = tmp[i]
                } else if (i >= sourceID && i < targetID) {
                    source[i] = tmp[i + 1]
                } else if (i == targetID) {
                    source[i] = tmp[sourceID]
                }
            }
        }
    });
    // $( "tr[data-tabullet-id='-1']" ).sortable( {
    //     group: 'group',
    //     // drop: false,
    //     drag: false
    // } );
});