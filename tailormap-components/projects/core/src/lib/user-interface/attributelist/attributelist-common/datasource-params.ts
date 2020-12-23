
export class DatasourceParams {

  public layerId = -1;
  public layerName = '';
  // Use for getting layer detail info.
  public featureTypeId = -1;
  public featureTypeName = ''; /* XXX Deze wordt gebruikt op het moment dat het om een related feature
  gaat, leeg = hoofdfeature, gevuld= related*/
  public featureFilter = ''; // XXX wat is dit, deze filter wordt gebruikt voor related-features
  public valueFilter = ''; // XXX wat is dit, deze filter wordt gevuld op het moment dat er een filter op een kolom wordt gezet in het tabel

  /**
   * Returns if the params are for getting data a detail table.
   */
  public hasDetail(): boolean {
    return (this.featureTypeName !== '');
  }
}
