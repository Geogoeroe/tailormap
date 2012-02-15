/*
 * Copyright (C) 2012 B3Partners B.V.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
package nl.b3p.viewer.admin.stripes;

import java.util.*;
import javax.annotation.security.RolesAllowed;
import net.sourceforge.stripes.action.*;
import net.sourceforge.stripes.controller.LifecycleStage;
import net.sourceforge.stripes.validation.Validate;
import nl.b3p.viewer.config.app.*;
import nl.b3p.viewer.config.security.Group;
import nl.b3p.viewer.config.services.*;
import org.json.*;
import org.stripesstuff.stripersist.Stripersist;

/**
 *
 * @author Jytte Schaeffer
 */
@UrlBinding("/action/applicationtreelayer/{$event}")
@StrictBinding
@RolesAllowed("ApplicationAdmin") 
public class ApplicationTreeLayerActionBean  extends ApplicationActionBean {
    private static final String JSP = "/WEB-INF/jsp/application/applicationTreeLayer.jsp";
    
    @Validate
    private ApplicationLayer applicationLayer;
    
    private List<Group> allGroups;
    
    @Validate
    private List<String> groupsRead = new ArrayList<String>();
    @Validate
    private List<String> groupsWrite = new ArrayList<String>();
    
    @Validate
    private Map<String,String> details = new HashMap<String,String>();
    
    private List<AttributeDescriptor> attributesList = new ArrayList<AttributeDescriptor>();
    
    @Validate
    private List<String> selectedAttributes = new ArrayList<String>();
    
    private boolean editable;
    
    @Validate
    private JSONArray attributesJSON = new JSONArray();
    
    @DefaultHandler
    public Resolution view() {
        Stripersist.getEntityManager().getTransaction().commit();
        
        return new ForwardResolution(JSP);
    }
    
    @DontValidate
    public Resolution edit() throws JSONException {
        if(applicationLayer != null){
            details = applicationLayer.getDetails();
                    
            groupsRead.addAll(applicationLayer.getReaders());
            groupsWrite.addAll(applicationLayer.getWriters());
            
            Layer layer = (Layer)Stripersist.getEntityManager().createQuery("from Layer "
                    + "where service = :service "
                    + "and name = :name")
                    .setParameter("service", applicationLayer.getService())
                    .setParameter("name", applicationLayer.getLayerName())
                    .getSingleResult();
            
            if(layer.getFeatureType() != null){
                SimpleFeatureType sft = layer.getFeatureType();
                editable = sft.isWriteable();
                attributesList = sft.getAttributes();
                
                for(Iterator it = applicationLayer.getAttributes().iterator(); it.hasNext();){
                    ConfiguredAttribute ca = (ConfiguredAttribute)it.next();
                    //set visible
                    if(ca.isVisible()){
                        selectedAttributes.add(ca.getAttributeName());
                    }
                }
                //set editable
                makeAttributeJSONArray(attributesJSON);
            }
        }
        
        return new ForwardResolution(JSP);
    }
    
    @Before(stages=LifecycleStage.BindingAndValidation)
    @SuppressWarnings("unchecked")
    public void load() {
        allGroups = Stripersist.getEntityManager().createQuery("from Group").getResultList();
    }
    
    public Resolution save() throws JSONException {
        applicationLayer.getDetails().clear();
        applicationLayer.getDetails().putAll(details);
        
        applicationLayer.getReaders().clear();
        for(String groupName: groupsRead) {
            applicationLayer.getReaders().add(groupName);
        }
        
        applicationLayer.getWriters().clear();
        for(String groupName: groupsWrite) {
            applicationLayer.getWriters().add(groupName);
        }
        
        if(applicationLayer.getAttributes() != null && applicationLayer.getAttributes().size() > 0){
            List<ConfiguredAttribute> appAttributes = applicationLayer.getAttributes();
            int i = 0;
            
            for(Iterator it = appAttributes.iterator(); it.hasNext();){
                ConfiguredAttribute appAttribute = (ConfiguredAttribute)it.next();
                //save visible
                if(selectedAttributes.contains(appAttribute.getAttributeName())){
                    appAttribute.setVisible(true);
                }else{
                    appAttribute.setVisible(false);
                }
                
                //save editable
                JSONObject attribute = attributesJSON.getJSONObject(i);
                
                if(attribute.has("editable")){
                    appAttribute.setEditable(new Boolean(attribute.get("editable").toString()));
                }
                if(attribute.has("editalias")){
                    appAttribute.setEditAlias(attribute.get("editalias").toString());
                }
                if(attribute.has("editvalues")){
                    appAttribute.setEditValues(attribute.get("editvalues").toString());
                }
                if(attribute.has("editheight")){
                    appAttribute.setEditHeight(attribute.get("editheight").toString());
                }

                //save selectable
                if(attribute.has("selectable")){
                    appAttribute.setSelectable(new Boolean(attribute.get("selectable").toString()));
                }
                if(attribute.has("filterable")){
                    appAttribute.setFilterable(new Boolean(attribute.get("filterable").toString()));
                }
                
                i++;
            }
        }
        
        Stripersist.getEntityManager().persist(applicationLayer);
        Stripersist.getEntityManager().getTransaction().commit();
        
        getContext().getMessages().add(new SimpleMessage("De kaartlaag is opgeslagen"));
        return new ForwardResolution(JSP);
    }
    
    private void makeAttributeJSONArray(JSONArray array) throws JSONException{
        List<ConfiguredAttribute> appAttributes = applicationLayer.getAttributes();
        int i = 0;
        for(Iterator it = appAttributes.iterator(); it.hasNext();){
            ConfiguredAttribute appAttribute = (ConfiguredAttribute)it.next();
            
            JSONObject j = new JSONObject();
            j.put("id", appAttribute.getId());
            j.put("name", appAttribute.getAttributeName());
            j.put("alias", attributesList.get(i).getAlias());
            j.put("visible", appAttribute.isVisible());
            j.put("editable", appAttribute.isEditable());
            j.put("editalias", appAttribute.getEditAlias());
            j.put("editvalues", appAttribute.getEditValues());
            j.put("editheight", appAttribute.getEditHeight());
            j.put("filterable", appAttribute.isFilterable());
            j.put("selectable", appAttribute.isSelectable());
            array.put(j);
            
            i++;
        }
    }

    //<editor-fold defaultstate="collapsed" desc="getters & setters">
    public ApplicationLayer getApplicationLayer() {
        return applicationLayer;
    }
    
    public void setApplicationLayer(ApplicationLayer applicationLayer) {
        this.applicationLayer = applicationLayer;
    }

    public List<Group> getAllGroups() {
        return allGroups;
    }

    public void setAllGroups(List<Group> allGroups) {
        this.allGroups = allGroups;
    }

    public Map<String, String> getDetails() {
        return details;
    }

    public void setDetails(Map<String, String> details) {
        this.details = details;
    }

    public List<String> getSelectedAttributes() {
        return selectedAttributes;
    }

    public void setSelectedAttributes(List<String> selectedAttributes) {
        this.selectedAttributes = selectedAttributes;
    }

    public List<AttributeDescriptor> getAttributesList() {
        return attributesList;
    }

    public void setAttributesList(List<AttributeDescriptor> attributesList) {
        this.attributesList = attributesList;
    }

    public JSONArray getAttributesJSON() {
        return attributesJSON;
    }

    public void setAttributesJSON(JSONArray attributesJSON) {
        this.attributesJSON = attributesJSON;
    }

    public boolean isEditable() {
        return editable;
    }

    public void setEditable(boolean editable) {
        this.editable = editable;
    }

    public List<String> getGroupsWrite() {
        return groupsWrite;
    }

    public void setGroupsWrite(List<String> groupsWrite) {
        this.groupsWrite = groupsWrite;
    }

    public List<String> getGroupsRead() {
        return groupsRead;
    }

    public void setGroupsRead(List<String> groupsRead) {
        this.groupsRead = groupsRead;
    }
    //</editor-fold>
}
