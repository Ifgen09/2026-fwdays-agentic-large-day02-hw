import { getCommonBounds } from "@excalidraw/element";
import throttle from "lodash.throttle";
import { useEffect, useMemo, useState, memo } from "react";

import { STATS_PANELS } from "@excalidraw/common";

import type { NonDeletedExcalidrawElement } from "@excalidraw/element/types";

import { t } from "../../i18n";
import { isGridModeEnabled } from "../../snapping";
import { useExcalidrawAppState, useExcalidrawSetAppState } from "../App";
import { Island } from "../Island";
import { CloseIcon } from "../icons";

import CanvasGrid from "./CanvasGrid";
import Collapsible from "./Collapsible";
import { ElementPropertiesPanel } from "./ElementPropertiesPanel";
import { StatsRow, StatsRows } from "./stats-rows";

import "./Stats.scss";

import type {
  AppClassProperties,
  AppState,
  ExcalidrawProps,
} from "../../types";

interface StatsProps {
  app: AppClassProperties;
  onClose: () => void;
  renderCustomStats: ExcalidrawProps["renderCustomStats"];
}

const STATS_TIMEOUT = 50;

export { ElementPropertiesPanel } from "./ElementPropertiesPanel";

export const Stats = (props: StatsProps) => {
  const appState = useExcalidrawAppState();
  const sceneNonce = props.app.scene.getSceneNonce() || 1;
  const selectedElements = props.app.scene.getSelectedElements({
    selectedElementIds: appState.selectedElementIds,
    includeBoundTextElement: false,
  });
  const gridModeEnabled = isGridModeEnabled(props.app);

  return (
    <StatsInner
      {...props}
      appState={appState}
      sceneNonce={sceneNonce}
      selectedElements={selectedElements}
      gridModeEnabled={gridModeEnabled}
    />
  );
};

Stats.StatsRow = StatsRow;
Stats.StatsRows = StatsRows;

export const StatsInner = memo(
  ({
    app,
    onClose,
    renderCustomStats,
    selectedElements,
    appState,
    sceneNonce,
    gridModeEnabled,
  }: StatsProps & {
    sceneNonce: number;
    selectedElements: readonly NonDeletedExcalidrawElement[];
    appState: AppState;
    gridModeEnabled: boolean;
  }) => {
    const scene = app.scene;
    const elements = scene.getNonDeletedElements();
    const elementsMap = scene.getNonDeletedElementsMap();
    const setAppState = useExcalidrawSetAppState();

    const [sceneDimension, setSceneDimension] = useState<{
      width: number;
      height: number;
    }>({
      width: 0,
      height: 0,
    });

    const throttledSetSceneDimension = useMemo(
      () =>
        throttle((elements: readonly NonDeletedExcalidrawElement[]) => {
          const boundingBox = getCommonBounds(elements);
          setSceneDimension({
            width: Math.round(boundingBox[2]) - Math.round(boundingBox[0]),
            height: Math.round(boundingBox[3]) - Math.round(boundingBox[1]),
          });
        }, STATS_TIMEOUT),
      [],
    );

    useEffect(() => {
      throttledSetSceneDimension(elements);
    }, [sceneNonce, elements, throttledSetSceneDimension]);

    useEffect(
      () => () => throttledSetSceneDimension.cancel(),
      [throttledSetSceneDimension],
    );

    return (
      <div className="exc-stats">
        <Island padding={3}>
          <div className="title">
            <h2>{t("stats.title")}</h2>
            <div className="close" onClick={onClose}>
              {CloseIcon}
            </div>
          </div>

          <Collapsible
            label={<h3>{t("stats.generalStats")}</h3>}
            open={!!(appState.stats.panels & STATS_PANELS.generalStats)}
            openTrigger={() =>
              setAppState((state) => {
                return {
                  stats: {
                    open: true,
                    panels: state.stats.panels ^ STATS_PANELS.generalStats,
                  },
                };
              })
            }
          >
            <StatsRows>
              <StatsRow heading>{t("stats.scene")}</StatsRow>
              <StatsRow columns={2}>
                <div>{t("stats.shapes")}</div>
                <div>{elements.length}</div>
              </StatsRow>
              <StatsRow columns={2}>
                <div>{t("stats.width")}</div>
                <div>{sceneDimension.width}</div>
              </StatsRow>
              <StatsRow columns={2}>
                <div>{t("stats.height")}</div>
                <div>{sceneDimension.height}</div>
              </StatsRow>
              {gridModeEnabled && (
                <>
                  <StatsRow heading>Canvas</StatsRow>
                  <StatsRow>
                    <CanvasGrid
                      property="gridStep"
                      scene={scene}
                      appState={appState}
                      setAppState={setAppState}
                    />
                  </StatsRow>
                </>
              )}
            </StatsRows>

            {renderCustomStats?.(elements, appState)}
          </Collapsible>

          <ElementPropertiesPanel
            scene={scene}
            elementsMap={elementsMap}
            appState={appState}
            setAppState={setAppState}
            selectedElements={selectedElements}
          />
        </Island>
      </div>
    );
  },
  (prev, next) => {
    return (
      prev.sceneNonce === next.sceneNonce &&
      prev.selectedElements === next.selectedElements &&
      prev.appState.stats.panels === next.appState.stats.panels &&
      prev.gridModeEnabled === next.gridModeEnabled &&
      prev.appState.gridStep === next.appState.gridStep &&
      prev.appState.croppingElementId === next.appState.croppingElementId
    );
  },
);
