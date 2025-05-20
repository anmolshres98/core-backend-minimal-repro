import { IModelDb, IModelHost, IModelHostOptions, IModelJsFs, SpatialCategory, StandaloneDb } from "@itwin/core-backend";
import { Logger, LogLevel } from "@itwin/core-bentley";

async function main() {
  console.log("Starting iTwin Core Backend Demo");

  try {
    Logger.initializeToConsole();
    Logger.setLevelDefault(LogLevel.Error);
    const cfg: IModelHostOptions = {};
    await IModelHost.startup(cfg);
    console.log("IModelHost initialized successfully!");

    const sourceFileName = "some.bim";
    const sourcePath = `bim-location/${sourceFileName}`;
    IModelJsFs.mkdirSync("bim-location");
    const iModel = StandaloneDb.createEmpty(sourcePath, {
      rootSubject: { name: sourceFileName },
    });

    // Not throwing an error
    iModel.performCheckpoint();

    SpatialCategory.insert(
      iModel,
      IModelDb.dictionaryId,
      "spatial category",
      {}
    );

    iModel.saveChanges("Created spatial category");
    // Throwing error: BE_SQLITE_LOCKED
    iModel.performCheckpoint();
    iModel.close();

    await IModelHost.shutdown();
    console.log("IModelHost shut down successfully");
  } catch (error) {
    console.error("Error:", error);
  }

  console.log("iTwin Core Backend Demo completed");
}

if (require.main === module) {
  main().catch((error) => {
    console.error("Unhandled error:", error);
    process.exit(1);
  });
}