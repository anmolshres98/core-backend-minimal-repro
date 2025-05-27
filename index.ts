import { CategorySelector, DefinitionModel, DisplayStyle2d, DrawingCategory, DrawingViewDefinition, IModelHost, IModelHostOptions, IModelJsFs, StandaloneDb, Subject } from "@itwin/core-backend";
import { Logger, LogLevel } from "@itwin/core-bentley";
import { IModel, SubCategoryAppearance } from "@itwin/core-common";
import { Range2d } from "@itwin/core-geometry";

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
    const subjectId = Subject.insert(
      iModel,
      IModel.rootSubjectId,
      "Subject",
      "Subject Description"
    );
    const definitionModelId = DefinitionModel.insert(
      iModel,
      subjectId,
      "Definition"
    );
    const drawingCategoryId = DrawingCategory.insert(
      iModel,
      definitionModelId,
      "DrawingCategory",
      new SubCategoryAppearance()
    );
    const drawingCategorySelectorId = CategorySelector.insert(
      iModel,
      definitionModelId,
      "DrawingCategories",
      [drawingCategoryId]
    );
    const displayStyle2dId = DisplayStyle2d.insert(
      iModel,
      definitionModelId,
      "DisplayStyle2d"
    );

    const drawingViewId = DrawingViewDefinition.insert(
      iModel,
      definitionModelId,
      "Drawing View",
      "0",
      drawingCategorySelectorId,
      displayStyle2dId,
      new Range2d(0, 0, 100, 100)
    );
    console.log("Drawing View Definition created with ID:", drawingViewId);
    iModel.elements.getElement(drawingViewId);

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