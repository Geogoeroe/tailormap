/* 
 * Copyright (C) 2012-2013 B3Partners B.V.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

Ext.Loader.setConfig({enabled: true});
Ext.Loader.setPath('Ext.ux', uxpath);
Ext.require([
    'Ext.grid.*',
    'Ext.data.*',
    'Ext.util.*',
    'Ext.ux.grid.GridHeaderFilters',
    'Ext.toolbar.Paging'
]);

Ext.onReady(function(){

    Ext.define('TableRow', {
        extend: 'Ext.data.Model',
        fields: [
            {name: 'id', type: 'int' },
            {name: 'featureType', type: 'string'},
            {name: 'layarService', type: 'string'}
        ]
    });

    var store = Ext.create('Ext.data.Store', {
        pageSize: 10,
        model: 'TableRow',
        remoteSort: true,
        remoteFilter: true,
        sorters: 'id',
        proxy: {
            type: 'ajax',
            url: gridurl,            
            reader: {
                type: 'json',
                root: 'gridrows',
                totalProperty: 'totalCount'
            },
            simpleSortMode: true
        },
        listeners: {
            load: function() {
                // Fix to apply filters
                Ext.getCmp('editGrid').updateLayout();
            }
        }
    });

    var grid = Ext.create('Ext.grid.Panel', Ext.merge(vieweradmin.components.DefaultConfgurations.getDefaultGridConfig(), {
        id: 'editGrid',
        store: store,
        columns: [
            {
                id: 'id',
                text: i18next.t('viewer_admin_layarsource_0'),
                dataIndex: 'id',
                flex: 1,
                filter: {
                    xtype: 'textfield'
                }
            },{
                id: 'featureType',
                text: i18next.t('viewer_admin_layarsource_1'),
                dataIndex: 'featureType',
                flex: 1,
                filter: {
                    xtype: 'textfield'
                }
            },{
                id: 'layarService',
                text: i18next.t('viewer_admin_layarsource_2'),
                dataIndex: 'layarService',
                flex: 1,
                filter: {
                    xtype: 'textfield'
                }
            },{
                id: 'edit',
                header: '',
                dataIndex: 'id',
                flex: 1,
                sortable: false,
                hideable: false,
                menuDisabled: true,
                renderer: function(value) {
                    return Ext.String.format('<a href="#" onclick="return editObject(\'{0}\');">' + i18next.t('viewer_admin_layarsource_3') + '</a>', value) +
                      ' | ' +
                      Ext.String.format('<a href="#" onclick="return removeObject(\'{0}\');">' + i18next.t('viewer_admin_layarsource_4') + '</a>', value);
                }
            }
        ],
        bbar: Ext.create('Ext.PagingToolbar', {
            store: store,
            displayInfo: true,
            displayMsg: i18next.t('viewer_admin_layarsource_5'),
            emptyMsg: i18next.t('viewer_admin_layarsource_6')
        }),
        plugins: [ 
            Ext.create('Ext.ux.grid.GridHeaderFilters', {
                enableTooltip: false
            })
        ],
        renderTo: 'grid-container'
    }));
});

function editObject(objId) {
    Ext.get('editFrame').dom.src = editurl + '?layarSource=' + objId;
    var gridCmp = Ext.getCmp('editGrid')
    gridCmp.getSelectionModel().select(gridCmp.getStore().find('id', objId));
    return false;
}

function removeObject(objId) {
    // How are we going to remove items? In the iframe or directly trough ajax?
    Ext.get('editFrame').dom.src = deleteurl + '?layarSource=' + objId;
    var gridCmp = Ext.getCmp('editGrid')
    gridCmp.getSelectionModel().select(gridCmp.getStore().find('id', objId));
    return false;
}
