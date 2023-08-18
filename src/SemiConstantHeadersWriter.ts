import {
  addHeader, createErrorMessage, getLoggerFor,
  MetadataWriter,
  MetadataWriterInput,
  ResourceIdentifier,
  StorageLocationStrategy
} from "@solid/community-server";


/**
 * A {@link MetadataWriter} that adds semi-constant headers to the response by replacing certain placeholders be their respective values.
 */
export class SemiConstantHeadersWriter extends MetadataWriter {
  protected readonly logger = getLoggerFor(this);

  private readonly storageStrategy: StorageLocationStrategy;
  private readonly headers: [string, string][];

  public constructor(storageStrategy: StorageLocationStrategy, headers: Record<string, string>) {
    super();
    this.storageStrategy = storageStrategy;
    this.headers = Object.entries(headers);
  }

  public async handle(input: MetadataWriterInput): Promise<void> {
    const storageRoot = await this.getStorageRoot({path: input.metadata.identifier.value});
    for (let [key, value] of this.headers) {
      if (storageRoot) {
        value = value.replace('{storageRoot}', storageRoot.path);
      }
      addHeader(input.response, key, value);
    }
    return Promise.resolve(undefined);
  }

  private getStorageRoot(identifier: ResourceIdentifier): Promise<ResourceIdentifier | undefined> {
    try {
      return this.storageStrategy.getStorageIdentifier(identifier);
    } catch (error: unknown) {
      this.logger.error(`Unable to find storage root: ${createErrorMessage(error)}`);
      return Promise.resolve(undefined);
    }
  }

}
