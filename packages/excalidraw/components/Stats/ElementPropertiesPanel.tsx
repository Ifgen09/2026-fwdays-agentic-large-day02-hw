import { round } from "@excalidraw/math";
import type { Component } from "react";
import { useMemo } from "react";

import { STATS_PANELS } from "@excalidraw/common";
import { elementsAreInSameGroup } from "@excalidraw/element";
import { frameAndChildrenSelectedTogether } from "@excalidraw/element";
import { getUncroppedWidthAndHeight } from "@excalidraw/element";
import { isImageElement } from "@excalidraw/element";

import type { Scene } from "@excalidraw/element";
import type {
  NonDeletedExcalidrawElement,
  NonDeletedSceneElementsMap,
} from "@excalidraw/element/types";

import { t } from "../../i18n";
import type { AppState } from "../../types";

import Angle from "./Angle";
import Collapsible from "./Collapsible";
import Dimension from "./Dimension";
import FontSize from "./FontSize";
import MultiAngle from "./MultiAngle";
import MultiDimension from "./MultiDimension";
import MultiFontSize from "./MultiFontSize";
import MultiPosition from "./MultiPosition";
import Position from "./Position";
import { StatsRow, StatsRows } from "./stats-rows";
import { getAtomicUnits } from "./utils";

export type ElementPropertiesPanelProps = {
  scene: Scene;
  elementsMap: NonDeletedSceneElementsMap;
  appState: AppState;
  setAppState: Component<any, AppState>["setState"];
  selectedElements: readonly NonDeletedExcalidrawElement[];
};

export const ElementPropertiesPanel = ({
  scene,
  elementsMap,
  appState,
  setAppState,
  selectedElements,
}: ElementPropertiesPanelProps) => {
  const singleElement =
    selectedElements.length === 1 ? selectedElements[0] : null;

  const multipleElements =
    selectedElements.length > 1 ? selectedElements : null;

  const cropMode =
    Boolean(appState.croppingElementId) && isImageElement(singleElement);

  const unCroppedDimension = cropMode
    ? getUncroppedWidthAndHeight(singleElement)
    : null;

  const atomicUnits = useMemo(
    () => getAtomicUnits(selectedElements, appState),
    [selectedElements, appState],
  );

  const frameAndChildrenTogether = useMemo(
    () => frameAndChildrenSelectedTogether(selectedElements),
    [selectedElements],
  );

  if (frameAndChildrenTogether || selectedElements.length === 0) {
    return null;
  }

  return (
    <div
      id="elementStats"
      style={{
        marginTop: 12,
      }}
    >
      <Collapsible
        label={<h3>{t("stats.elementProperties")}</h3>}
        open={!!(appState.stats.panels & STATS_PANELS.elementProperties)}
        openTrigger={() =>
          setAppState((state) => {
            return {
              stats: {
                open: true,
                panels: state.stats.panels ^ STATS_PANELS.elementProperties,
              },
            };
          })
        }
      >
        <StatsRows>
          {singleElement && (
            <>
              {cropMode && (
                <StatsRow heading>{t("labels.unCroppedDimension")}</StatsRow>
              )}

              {appState.croppingElementId &&
                isImageElement(singleElement) &&
                unCroppedDimension && (
                  <StatsRow columns={2}>
                    <div>{t("stats.width")}</div>
                    <div>{round(unCroppedDimension.width, 2)}</div>
                  </StatsRow>
                )}

              {appState.croppingElementId &&
                isImageElement(singleElement) &&
                unCroppedDimension && (
                  <StatsRow columns={2}>
                    <div>{t("stats.height")}</div>
                    <div>{round(unCroppedDimension.height, 2)}</div>
                  </StatsRow>
                )}

              <StatsRow
                heading
                data-testid="stats-element-type"
                style={{ margin: "0.3125rem 0" }}
              >
                {appState.croppingElementId
                  ? t("labels.imageCropping")
                  : t(`element.${singleElement.type}`)}
              </StatsRow>

              <StatsRow>
                <Position
                  element={singleElement}
                  property="x"
                  elementsMap={elementsMap}
                  scene={scene}
                  appState={appState}
                />
              </StatsRow>
              <StatsRow>
                <Position
                  element={singleElement}
                  property="y"
                  elementsMap={elementsMap}
                  scene={scene}
                  appState={appState}
                />
              </StatsRow>
              <StatsRow>
                <Dimension
                  property="width"
                  element={singleElement}
                  scene={scene}
                  appState={appState}
                />
              </StatsRow>
              <StatsRow>
                <Dimension
                  property="height"
                  element={singleElement}
                  scene={scene}
                  appState={appState}
                />
              </StatsRow>
              <StatsRow>
                <Angle
                  property="angle"
                  element={singleElement}
                  scene={scene}
                  appState={appState}
                />
              </StatsRow>
              <StatsRow>
                <FontSize
                  property="fontSize"
                  element={singleElement}
                  scene={scene}
                  appState={appState}
                />
              </StatsRow>
            </>
          )}

          {multipleElements && (
            <>
              {elementsAreInSameGroup(multipleElements) && (
                <StatsRow heading>{t("element.group")}</StatsRow>
              )}

              <StatsRow columns={2} style={{ margin: "0.3125rem 0" }}>
                <div>{t("stats.shapes")}</div>
                <div>{selectedElements.length}</div>
              </StatsRow>

              <StatsRow>
                <MultiPosition
                  property="x"
                  elements={multipleElements}
                  elementsMap={elementsMap}
                  atomicUnits={atomicUnits}
                  scene={scene}
                  appState={appState}
                />
              </StatsRow>
              <StatsRow>
                <MultiPosition
                  property="y"
                  elements={multipleElements}
                  elementsMap={elementsMap}
                  atomicUnits={atomicUnits}
                  scene={scene}
                  appState={appState}
                />
              </StatsRow>
              <StatsRow>
                <MultiDimension
                  property="width"
                  elements={multipleElements}
                  elementsMap={elementsMap}
                  atomicUnits={atomicUnits}
                  scene={scene}
                  appState={appState}
                />
              </StatsRow>
              <StatsRow>
                <MultiDimension
                  property="height"
                  elements={multipleElements}
                  elementsMap={elementsMap}
                  atomicUnits={atomicUnits}
                  scene={scene}
                  appState={appState}
                />
              </StatsRow>
              <StatsRow>
                <MultiAngle
                  property="angle"
                  elements={multipleElements}
                  scene={scene}
                  appState={appState}
                />
              </StatsRow>
              <StatsRow>
                <MultiFontSize
                  property="fontSize"
                  elements={multipleElements}
                  scene={scene}
                  appState={appState}
                  elementsMap={elementsMap}
                />
              </StatsRow>
            </>
          )}
        </StatsRows>
      </Collapsible>
    </div>
  );
};
