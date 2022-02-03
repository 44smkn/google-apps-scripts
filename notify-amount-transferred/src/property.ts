export interface PropertyStore {
  get(key: string): string | undefined;
}

export class ScriptPropertyStore implements PropertyStore {
  constructor(
    private props: GoogleAppsScript.Properties.Properties = PropertiesService.getScriptProperties()
  ) {}

  get(key: string): string | undefined {
    const val = this.props.getProperty(key);
    if (val == null) {
      return undefined;
    }
    return val;
  }
}
