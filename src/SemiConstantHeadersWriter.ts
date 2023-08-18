import {
  addHeader,
  createErrorMessage,
  getLoggerFor, LDP,
  MetadataWriter,
  MetadataWriterInput, RDF,
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
    // This indicates this is the response of a successful GET/HEAD request
    if (!input.metadata.has(RDF.terms.type, LDP.terms.Resource)) {
      return;
    }

    // Get necessary replacement values.
    const storageRoot = await this.getStorageRoot({path: input.metadata.identifier.value});

    // Go through all headers, replace placeholders and add them to the response.
    for (let [key, value] of this.headers) {
      // storageRoot placeholder
      if (value.includes('{storageRoot}')) {
        if (storageRoot) {
          value = value.replace('{storageRoot}', storageRoot.path);
        } else {
          // Skip this header if it contains the storageRoot placeholder and the storage root could not be found.
          continue;
        }
      }

      // Add header if all placeholders have been replaced successfully.
      addHeader(input.response, key, value);
    }
  }

  private getStorageRoot(identifier: ResourceIdentifier): Promise<ResourceIdentifier> | undefined {
    try {
      return this.storageStrategy.getStorageIdentifier(identifier);
    } catch (error: unknown) {
      this.logger.error(`Unable to find storage root: ${createErrorMessage(error)}`);
    }
  }

}
