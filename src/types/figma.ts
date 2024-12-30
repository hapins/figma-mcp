export interface Color {
  r: number;
  g: number;
  b: number;
  a: number;
}

export interface Vector {
  x: number;
  y: number;
}

export interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Transform {
  matrix: [[number, number, number], [number, number, number]];
}

export interface LayoutConstraint {
  vertical: 'TOP' | 'BOTTOM' | 'CENTER' | 'TOP_BOTTOM' | 'SCALE';
  horizontal: 'LEFT' | 'RIGHT' | 'CENTER' | 'LEFT_RIGHT' | 'SCALE';
}

export interface BlendMode {
  type:
    | 'PASS_THROUGH'
    | 'NORMAL'
    | 'DARKEN'
    | 'MULTIPLY'
    | 'LINEAR_BURN'
    | 'COLOR_BURN'
    | 'LIGHTEN'
    | 'SCREEN'
    | 'LINEAR_DODGE'
    | 'COLOR_DODGE'
    | 'OVERLAY'
    | 'SOFT_LIGHT'
    | 'HARD_LIGHT'
    | 'DIFFERENCE'
    | 'EXCLUSION'
    | 'HUE'
    | 'SATURATION'
    | 'COLOR'
    | 'LUMINOSITY';
}

export interface Paint {
  type:
    | 'SOLID'
    | 'GRADIENT_LINEAR'
    | 'GRADIENT_RADIAL'
    | 'GRADIENT_ANGULAR'
    | 'GRADIENT_DIAMOND'
    | 'IMAGE'
    | 'EMOJI';
  visible?: boolean;
  opacity?: number;
  color?: Color;
  gradientHandlePositions?: Vector[];
  gradientStops?: { position: number; color: Color }[];
  imageRef?: string;
  scaleMode?: 'FILL' | 'FIT' | 'TILE' | 'STRETCH';
}

export interface Effect {
  type: 'INNER_SHADOW' | 'DROP_SHADOW' | 'LAYER_BLUR' | 'BACKGROUND_BLUR';
  visible?: boolean;
  radius?: number;
  color?: Color;
  offset?: Vector;
  spread?: number;
}

export interface BaseNode {
  id: string;
  name: string;
  visible?: boolean;
  type: string;
  pluginData?: { [key: string]: any };
  sharedPluginData?: { [namespace: string]: { [key: string]: any } };
}

export interface DocumentNode extends BaseNode {
  type: 'DOCUMENT';
  children: SceneNode[];
}

export interface CanvasNode extends BaseNode {
  type: 'CANVAS';
  children: SceneNode[];
  backgroundColor: Color;
  exportSettings?: ExportSetting[];
}

export interface FrameNode extends BaseNode {
  type: 'FRAME';
  children: SceneNode[];
  locked?: boolean;
  background: Paint[];
  backgroundColor?: Color;
  exportSettings?: ExportSetting[];
  blendMode?: BlendMode;
  preserveRatio?: boolean;
  constraints?: LayoutConstraint;
  layoutAlign?: 'MIN' | 'CENTER' | 'MAX' | 'STRETCH';
  layoutGrow?: number;
  clipsContent?: boolean;
  layoutMode?: 'NONE' | 'HORIZONTAL' | 'VERTICAL';
  primaryAxisSizingMode?: 'FIXED' | 'AUTO';
  counterAxisSizingMode?: 'FIXED' | 'AUTO';
  primaryAxisAlignItems?: 'MIN' | 'CENTER' | 'MAX' | 'SPACE_BETWEEN';
  counterAxisAlignItems?: 'MIN' | 'CENTER' | 'MAX';
  paddingLeft?: number;
  paddingRight?: number;
  paddingTop?: number;
  paddingBottom?: number;
  itemSpacing?: number;
}

export interface GroupNode extends BaseNode {
  type: 'GROUP';
  children: SceneNode[];
  locked?: boolean;
  exportSettings?: ExportSetting[];
  blendMode?: BlendMode;
  preserveRatio?: boolean;
  constraints?: LayoutConstraint;
  layoutAlign?: 'MIN' | 'CENTER' | 'MAX' | 'STRETCH';
  layoutGrow?: number;
}

export interface VectorNode extends BaseNode {
  type: 'VECTOR';
  locked?: boolean;
  exportSettings?: ExportSetting[];
  blendMode?: BlendMode;
  preserveRatio?: boolean;
  constraints?: LayoutConstraint;
  layoutAlign?: 'MIN' | 'CENTER' | 'MAX' | 'STRETCH';
  layoutGrow?: number;
  strokeWeight?: number;
  strokeAlign?: 'INSIDE' | 'OUTSIDE' | 'CENTER';
  strokeCap?: 'NONE' | 'ROUND' | 'SQUARE' | 'LINE_ARROW' | 'TRIANGLE_ARROW';
  strokeJoin?: 'MITER' | 'BEVEL' | 'ROUND';
  strokeMiterLimit?: number;
  strokeGeometry?: Path[];
  fillGeometry?: Path[];
  fills?: Paint[];
  strokes?: Paint[];
  effects?: Effect[];
}

export interface BooleanOperationNode extends BaseNode {
  type: 'BOOLEAN_OPERATION';
  children: SceneNode[];
  locked?: boolean;
  exportSettings?: ExportSetting[];
  blendMode?: BlendMode;
  preserveRatio?: boolean;
  constraints?: LayoutConstraint;
  layoutAlign?: 'MIN' | 'CENTER' | 'MAX' | 'STRETCH';
  layoutGrow?: number;
  booleanOperation: 'UNION' | 'INTERSECT' | 'SUBTRACT' | 'EXCLUDE';
}

export interface StarNode extends BaseNode {
  type: 'STAR';
  locked?: boolean;
  exportSettings?: ExportSetting[];
  blendMode?: BlendMode;
  preserveRatio?: boolean;
  constraints?: LayoutConstraint;
  layoutAlign?: 'MIN' | 'CENTER' | 'MAX' | 'STRETCH';
  layoutGrow?: number;
  fills?: Paint[];
  strokes?: Paint[];
  strokeWeight?: number;
  strokeAlign?: 'INSIDE' | 'OUTSIDE' | 'CENTER';
  effects?: Effect[];
  pointCount: number;
  innerRadius: number;
}

export interface LineNode extends BaseNode {
  type: 'LINE';
  locked?: boolean;
  exportSettings?: ExportSetting[];
  blendMode?: BlendMode;
  preserveRatio?: boolean;
  constraints?: LayoutConstraint;
  layoutAlign?: 'MIN' | 'CENTER' | 'MAX' | 'STRETCH';
  layoutGrow?: number;
  strokes?: Paint[];
  strokeWeight?: number;
  strokeAlign?: 'INSIDE' | 'OUTSIDE' | 'CENTER';
  strokeCap?: 'NONE' | 'ROUND' | 'SQUARE' | 'LINE_ARROW' | 'TRIANGLE_ARROW';
  effects?: Effect[];
}

export interface TextNode extends BaseNode {
  type: 'TEXT';
  locked?: boolean;
  exportSettings?: ExportSetting[];
  blendMode?: BlendMode;
  preserveRatio?: boolean;
  constraints?: LayoutConstraint;
  layoutAlign?: 'MIN' | 'CENTER' | 'MAX' | 'STRETCH';
  layoutGrow?: number;
  characters: string;
  style: TypeStyle;
  characterStyleOverrides?: number[];
  styleOverrideTable?: { [index: number]: TypeStyle };
}

export interface ComponentNode extends BaseNode {
  type: 'COMPONENT';
  children: SceneNode[];
  locked?: boolean;
  exportSettings?: ExportSetting[];
  blendMode?: BlendMode;
  preserveRatio?: boolean;
  constraints?: LayoutConstraint;
  layoutAlign?: 'MIN' | 'CENTER' | 'MAX' | 'STRETCH';
  layoutGrow?: number;
  componentId: string;
}

export interface InstanceNode extends BaseNode {
  type: 'INSTANCE';
  children: SceneNode[];
  locked?: boolean;
  exportSettings?: ExportSetting[];
  blendMode?: BlendMode;
  preserveRatio?: boolean;
  constraints?: LayoutConstraint;
  layoutAlign?: 'MIN' | 'CENTER' | 'MAX' | 'STRETCH';
  layoutGrow?: number;
  componentId: string;
}

export interface Path {
  path: string;
  windingRule: 'NONZERO' | 'EVENODD';
}

export interface TypeStyle {
  fontFamily: string;
  fontPostScriptName?: string;
  paragraphSpacing?: number;
  paragraphIndent?: number;
  italic?: boolean;
  fontWeight: number;
  fontSize: number;
  textCase?: 'ORIGINAL' | 'UPPER' | 'LOWER' | 'TITLE';
  textDecoration?: 'NONE' | 'STRIKETHROUGH' | 'UNDERLINE';
  textAlignHorizontal: 'LEFT' | 'RIGHT' | 'CENTER' | 'JUSTIFIED';
  textAlignVertical?: 'TOP' | 'CENTER' | 'BOTTOM';
  letterSpacing: number;
  fills?: Paint[];
  lineHeightPx?: number;
  lineHeightPercent?: number;
  lineHeightUnit: 'PIXELS' | 'PERCENT';
}

export interface ExportSetting {
  suffix: string;
  format: 'JPG' | 'PNG' | 'SVG' | 'PDF';
  constraint: {
    type: 'SCALE' | 'WIDTH' | 'HEIGHT';
    value: number;
  };
}

export type SceneNode =
  | FrameNode
  | GroupNode
  | VectorNode
  | BooleanOperationNode
  | StarNode
  | LineNode
  | TextNode
  | ComponentNode
  | InstanceNode;

export interface FigmaFile {
  key: string;
  name: string;
  lastModified: string;
  thumbnailUrl: string;
  version: string;
}

export interface FigmaFileVersion {
  id: string;
  created_at: string;
  label: string;
  description: string;
  user: {
    id: string;
    handle: string;
    img_url: string;
  };
}

export interface FigmaComment {
  id: string;
  file_key: string;
  parent_id: string;
  user: {
    id: string;
    handle: string;
    img_url: string;
  };
  created_at: string;
  resolved_at: string | null;
  message: string;
  client_meta: {
    x: number;
    y: number;
    node_id: string;
    node_offset: {
      x: number;
      y: number;
    };
  } | null;
  order_id: string;
}

export interface FigmaComponent {
  key: string;
  name: string;
  description?: string;
  componentSetId?: string;
  documentationLinks?: string[];
}

export interface FigmaStyle {
  key: string;
  name: string;
  description?: string;
  styleType: string;
}
