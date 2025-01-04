/**
 * Represents a color in RGBA format.
 */
export interface Color {
  r: number;
  g: number;
  b: number;
  a: number;
}

/**
 * Represents a 2D vector with x and y coordinates.
 */
export interface Vector {
  x: number;
  y: number;
}

/**
 * Represents a rectangle with position and dimensions.
 */
export interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Represents a 2D transformation matrix.
 */
export interface Transform {
  matrix: [[number, number, number], [number, number, number]];
}

/**
 * Represents layout constraints for auto-layout frames.
 */
export interface LayoutConstraint {
  vertical: 'TOP' | 'BOTTOM' | 'CENTER' | 'TOP_BOTTOM' | 'SCALE';
  horizontal: 'LEFT' | 'RIGHT' | 'CENTER' | 'LEFT_RIGHT' | 'SCALE';
}

/**
 * Represents the blending mode for layers.
 */
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

/**
 * Represents a paint style that can be solid color, gradient, or image.
 */
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

/**
 * Represents a visual effect like shadows or blurs.
 */
export interface Effect {
  type: 'INNER_SHADOW' | 'DROP_SHADOW' | 'LAYER_BLUR' | 'BACKGROUND_BLUR';
  visible?: boolean;
  radius?: number;
  color?: Color;
  offset?: Vector;
  spread?: number;
}

/**
 * Base interface for all Figma nodes.
 */
export interface BaseNode {
  id: string;
  name: string;
  visible?: boolean;
  type: string;
  pluginData?: { [key: string]: any };
  sharedPluginData?: { [namespace: string]: { [key: string]: any } };
}

/**
 * Represents the root node of a Figma document.
 */
export interface DocumentNode extends BaseNode {
  type: 'DOCUMENT';
  children: SceneNode[];
}

/**
 * Represents a canvas/artboard in a Figma document.
 */
export interface CanvasNode extends BaseNode {
  type: 'CANVAS';
  children: SceneNode[];
  backgroundColor: Color;
  exportSettings?: ExportSetting[];
}

/**
 * Represents a frame in Figma, which can contain other nodes.
 */
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

/**
 * Represents a group of nodes in Figma.
 */
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

/**
 * Represents a vector node in Figma.
 */
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

/**
 * Represents a boolean operation (union, intersection, etc.) between shapes.
 */
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

/**
 * Represents a star shape in Figma.
 */
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

/**
 * Represents a line in Figma.
 */
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

/**
 * Represents a text node in Figma.
 */
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

/**
 * Represents a component definition in Figma.
 */
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

/**
 * Represents an instance of a component in Figma.
 */
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

/**
 * Represents a path used in vector nodes.
 */
export interface Path {
  path: string;
  windingRule: 'NONZERO' | 'EVENODD';
}

/**
 * Represents text styling properties.
 */
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

/**
 * Represents export settings for a node.
 */
export interface ExportSetting {
  suffix: string;
  format: 'JPG' | 'PNG' | 'SVG' | 'PDF';
  constraint: {
    type: 'SCALE' | 'WIDTH' | 'HEIGHT';
    value: number;
  };
}

/**
 * Union type of all possible node types in a Figma scene.
 */
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

/**
 * Represents a Figma file metadata.
 */
export interface FigmaFile {
  key: string;
  name: string;
  lastModified: string;
  thumbnailUrl: string;
  version: string;
}

/**
 * Represents a version of a Figma file.
 */
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

/**
 * Represents a comment on a Figma file.
 */
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

/**
 * Represents a component in Figma's component library.
 */
export interface FigmaComponent {
  key: string;
  name: string;
  description?: string;
  componentSetId?: string;
  documentationLinks?: string[];
}

/**
 * Represents a style in Figma's style library.
 */
export interface FigmaStyle {
  key: string;
  name: string;
  description?: string;
  styleType: string;
}
