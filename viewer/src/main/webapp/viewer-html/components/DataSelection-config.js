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

/**
 * Custom configuration object for AttributeList configuration
 * @author <a href="mailto:roybraam@b3partners.nl">Roy Braam</a>
 */
Ext.define("viewer.components.CustomConfiguration",{
    extend: "viewer.components.SelectionWindowConfig",
    constructor: function (parentId, configObject, configPage) {
        if (configObject === null){
            configObject = {};
        }
        configObject.showLabelconfig =true;
        viewer.components.CustomConfiguration.superclass.constructor.call(this, parentId, configObject, configPage);        
        this.form.add([
        {
            xtype: "textfield",
            name: "maxFeatures",
            fieldLabel: i18next.t('dataselection_config_0'),
            labelWidth:this.labelWidth,
            width: 500,
            id: "maxFeatures",
            value: configObject.maxFeatures ? configObject.maxFeatures : 250
        },
        {
            xtype: 'checkbox',
            fieldLabel: i18next.t('dataselection_config_1'),
            inputValue: true,
            name: 'openAttributeListAfterFilter',
            checked: this.configObject.openAttributeListAfterFilter || false,
            labelWidth: this.labelWidth
        }
        ]);
        this.createCheckBoxes(this.configObject.layers,{filterable:true});
    },
    getDefaultValues: function() {
        return {
            details: {
                minWidth: 600,
                minHeight: 300
            }
        }
    }
});

