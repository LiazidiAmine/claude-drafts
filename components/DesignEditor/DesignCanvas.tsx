'use client';

import { useEffect, useRef, useState } from 'react';
import { Stage, Layer, Text, Transformer, Rect, Group, Line } from 'react-konva';
import { useCustomizerStore } from '@/store/useCustomizerStore';
import { DESIGN_CONSTRAINTS, FONTS } from '@/lib/constants';
import Konva from 'konva';

interface DesignCanvasProps {
  className?: string;
}

export function DesignCanvas({ className }: DesignCanvasProps) {
  const { front, back, currentSide, updateDesign, updateText } = useCustomizerStore();

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [alignmentGuides, setAlignmentGuides] = useState({
    vertical: false,
    horizontal: false,
  });
  const [dragPosition, setDragPosition] = useState<{ x: number; y: number } | null>(null);

  const stageRef = useRef<Konva.Stage>(null);
  const emojiRef = useRef<Konva.Text>(null);
  const textRef = useRef<Konva.Text>(null);
  const transformerRef = useRef<Konva.Transformer>(null);

  const currentCanvas = currentSide === 'front' ? front : back;
  const { design, text } = currentCanvas;

  // Attach transformer to selected element
  useEffect(() => {
    if (!transformerRef.current) return;

    if (selectedId === 'design' && emojiRef.current) {
      transformerRef.current.nodes([emojiRef.current]);
    } else if (selectedId === 'text' && textRef.current) {
      transformerRef.current.nodes([textRef.current]);
    } else {
      transformerRef.current.nodes([]);
    }

    transformerRef.current.getLayer()?.batchDraw();
  }, [selectedId]);

  // Printable area constraints (torso only, excluding collar and sleeves)
  const PRINTABLE_AREA = {
    x: 85,
    y: 120,
    width: 230,
    height: 300,
  };

  // Snap configuration
  const SNAP_THRESHOLD = 10; // pixels
  const centerX = DESIGN_CONSTRAINTS.CANVAS_WIDTH / 2;
  const centerY = DESIGN_CONSTRAINTS.CANVAS_HEIGHT / 2;

  const constrainToStagePrintableArea = (x: number, y: number, width: number, height: number) => {
    return {
      x: Math.max(PRINTABLE_AREA.x, Math.min(x, PRINTABLE_AREA.x + PRINTABLE_AREA.width - width)),
      y: Math.max(PRINTABLE_AREA.y, Math.min(y, PRINTABLE_AREA.y + PRINTABLE_AREA.height - height)),
    };
  };

  // Snap to center with alignment guides
  const snapToCenter = (x: number, y: number, width: number, height: number) => {
    const elementCenterX = x + width / 2;
    const elementCenterY = y + height / 2;

    let snappedX = x;
    let snappedY = y;
    const guides = { vertical: false, horizontal: false };

    // Snap to center X
    if (Math.abs(elementCenterX - centerX) < SNAP_THRESHOLD) {
      snappedX = centerX - width / 2;
      guides.vertical = true;
    }

    // Snap to center Y
    if (Math.abs(elementCenterY - centerY) < SNAP_THRESHOLD) {
      snappedY = centerY - height / 2;
      guides.horizontal = true;
    }

    setAlignmentGuides(guides);

    return { x: snappedX, y: snappedY };
  };

  const handleStageClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
    // Deselect when clicking on empty area
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      setSelectedId(null);
    }
  };

  const handleDesignDragMove = (e: Konva.KonvaEventObject<DragEvent>) => {
    if (!design) return;
    snapToCenter(e.target.x(), e.target.y(), design.width, design.height);
    setDragPosition({ x: Math.round(e.target.x()), y: Math.round(e.target.y()) });
  };

  const handleDesignDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
    if (!design) return;

    // Apply snap
    const snapped = snapToCenter(e.target.x(), e.target.y(), design.width, design.height);

    // Apply constraints
    const constrained = constrainToStagePrintableArea(
      snapped.x,
      snapped.y,
      design.width,
      design.height
    );

    updateDesign(constrained);

    // Hide indicators after a delay
    setDragPosition(null);
    setTimeout(() => {
      setAlignmentGuides({ vertical: false, horizontal: false });
    }, 1000);
  };

  const handleDesignTransformEnd = () => {
    if (!design || !emojiRef.current) return;

    const node = emojiRef.current;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();

    // Reset scale and update width/height
    node.scaleX(1);
    node.scaleY(1);

    updateDesign({
      x: node.x(),
      y: node.y(),
      width: Math.max(DESIGN_CONSTRAINTS.MIN_SIZE, node.width() * scaleX),
      height: Math.max(DESIGN_CONSTRAINTS.MIN_SIZE, node.height() * scaleY),
      rotation: node.rotation(),
    });
  };

  const handleTextDragMove = (e: Konva.KonvaEventObject<DragEvent>) => {
    if (!text) return;
    snapToCenter(e.target.x(), e.target.y(), e.target.width(), e.target.height());
    setDragPosition({ x: Math.round(e.target.x()), y: Math.round(e.target.y()) });
  };

  const handleTextDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
    if (!text) return;

    // Apply snap
    const snapped = snapToCenter(
      e.target.x(),
      e.target.y(),
      e.target.width(),
      e.target.height()
    );

    // Apply constraints
    const constrained = constrainToStagePrintableArea(
      snapped.x,
      snapped.y,
      e.target.width(),
      e.target.height()
    );

    updateText(constrained);

    // Hide indicators after a delay
    setDragPosition(null);
    setTimeout(() => {
      setAlignmentGuides({ vertical: false, horizontal: false });
    }, 1000);
  };

  const handleTextTransformEnd = () => {
    if (!text || !textRef.current) return;

    const node = textRef.current;

    updateText({
      x: node.x(),
      y: node.y(),
      fontSize: Math.max(DESIGN_CONSTRAINTS.TEXT_MIN_SIZE, node.fontSize() * node.scaleY()),
      rotation: node.rotation(),
    });

    node.scaleX(1);
    node.scaleY(1);
  };

  const getFontFamily = (font: string) => {
    const fontConfig = FONTS.find(f => f.value === font);
    return fontConfig?.fontFamily || 'Arial, sans-serif';
  };

  return (
    <div className={`rounded-lg bg-white shadow-lg ${className} relative`}>
      {/* Position indicator */}
      {dragPosition && (
        <div className="absolute top-4 right-4 bg-gray-900 text-white px-4 py-2 rounded-lg shadow-xl z-50 font-mono text-sm font-bold">
          <div className="flex items-center gap-2">
            <span className="text-xs opacity-70">Position:</span>
            <span>X: {dragPosition.x}</span>
            <span className="opacity-50">|</span>
            <span>Y: {dragPosition.y}</span>
          </div>
        </div>
      )}

      <Stage
        ref={stageRef}
        width={DESIGN_CONSTRAINTS.CANVAS_WIDTH}
        height={DESIGN_CONSTRAINTS.CANVAS_HEIGHT}
        onClick={handleStageClick}
      >
        <Layer>
          {/* Background - light gray */}
          <Rect
            x={0}
            y={0}
            width={DESIGN_CONSTRAINTS.CANVAS_WIDTH}
            height={DESIGN_CONSTRAINTS.CANVAS_HEIGHT}
            fill="#F9FAFB"
          />

          {/* T-Shirt Silhouette - Modern design with gradient and depth */}
          <Group listening={false}>
            {/* Main body with gradient */}
            <Rect
              x={75}
              y={80}
              width={250}
              height={350}
              fillLinearGradientStartPoint={{ x: 0, y: 0 }}
              fillLinearGradientEndPoint={{ x: 0, y: 350 }}
              fillLinearGradientColorStops={[0, '#FFFFFF', 0.5, '#F9FAFB', 1, '#F3F4F6']}
              stroke="#D1D5DB"
              strokeWidth={2}
              cornerRadius={[10, 10, 15, 15]}
              shadowColor="rgba(0,0,0,0.08)"
              shadowBlur={15}
              shadowOffsetX={0}
              shadowOffsetY={2}
            />

            {/* Left sleeve with gradient */}
            <Rect
              x={30}
              y={80}
              width={50}
              height={120}
              fillLinearGradientStartPoint={{ x: 0, y: 0 }}
              fillLinearGradientEndPoint={{ x: 50, y: 0 }}
              fillLinearGradientColorStops={[0, '#F9FAFB', 1, '#FFFFFF']}
              stroke="#D1D5DB"
              strokeWidth={2}
              cornerRadius={[8, 0, 0, 8]}
              shadowColor="rgba(0,0,0,0.06)"
              shadowBlur={10}
              shadowOffsetX={-2}
              shadowOffsetY={2}
            />

            {/* Right sleeve with gradient */}
            <Rect
              x={320}
              y={80}
              width={50}
              height={120}
              fillLinearGradientStartPoint={{ x: 0, y: 0 }}
              fillLinearGradientEndPoint={{ x: 50, y: 0 }}
              fillLinearGradientColorStops={[0, '#FFFFFF', 1, '#F9FAFB']}
              stroke="#D1D5DB"
              strokeWidth={2}
              cornerRadius={[0, 8, 8, 0]}
              shadowColor="rgba(0,0,0,0.06)"
              shadowBlur={10}
              shadowOffsetX={2}
              shadowOffsetY={2}
            />

            {/* Collar/Neck with gradient */}
            <Rect
              x={175}
              y={70}
              width={50}
              height={30}
              fillLinearGradientStartPoint={{ x: 0, y: 0 }}
              fillLinearGradientEndPoint={{ x: 0, y: 30 }}
              fillLinearGradientColorStops={[0, '#FFFFFF', 1, '#F9FAFB']}
              stroke="#D1D5DB"
              strokeWidth={2}
              cornerRadius={[5, 5, 0, 0]}
            />

            {/* Inner shadow overlay for depth on main body */}
            <Rect
              x={77}
              y={82}
              width={246}
              height={346}
              fill="transparent"
              stroke="rgba(0,0,0,0.03)"
              strokeWidth={1}
              cornerRadius={[10, 10, 15, 15]}
            />

            {/* Subtle stitching detail */}
            <Rect
              x={80}
              y={85}
              width={240}
              height={340}
              fill="transparent"
              stroke="rgba(0,0,0,0.02)"
              strokeWidth={1}
              dash={[5, 5]}
              cornerRadius={[8, 8, 13, 13]}
            />

            {/* Label on silhouette */}
            <Text
              text="Zone Imprimable"
              x={DESIGN_CONSTRAINTS.CANVAS_WIDTH / 2}
              y={440}
              fontSize={11}
              fontFamily="Arial"
              fill="#9CA3AF"
              align="center"
              offsetX={42}
              fontStyle="bold"
              letterSpacing={0.5}
            />
          </Group>

          {/* Alignment Guides - Canva style */}
          {alignmentGuides.vertical && (
            <Line
              points={[centerX, 0, centerX, DESIGN_CONSTRAINTS.CANVAS_HEIGHT]}
              stroke="#EF4444"
              strokeWidth={2}
              dash={[10, 5]}
              listening={false}
              opacity={0.8}
            />
          )}
          {alignmentGuides.horizontal && (
            <Line
              points={[0, centerY, DESIGN_CONSTRAINTS.CANVAS_WIDTH, centerY]}
              stroke="#EF4444"
              strokeWidth={2}
              dash={[10, 5]}
              listening={false}
              opacity={0.8}
            />
          )}

          {/* Design emoji */}
          {design && (
            <Text
              ref={emojiRef}
              text={design.emoji || '🎨'}
              x={design.x}
              y={design.y}
              width={design.width}
              height={design.height}
              fontSize={design.width * 0.7}
              fontFamily="Arial"
              align="center"
              verticalAlign="middle"
              rotation={design.rotation}
              draggable
              onClick={() => setSelectedId('design')}
              onTap={() => setSelectedId('design')}
              onDragMove={handleDesignDragMove}
              onDragEnd={handleDesignDragEnd}
              onTransformEnd={handleDesignTransformEnd}
              shadowColor="#A855F7"
              shadowBlur={selectedId === 'design' ? 15 : 5}
              shadowOpacity={0.5}
            />
          )}

          {/* Text */}
          {text && (
            <Text
              ref={textRef}
              text={text.content}
              x={text.x}
              y={text.y}
              fontSize={text.fontSize}
              fontFamily={getFontFamily(text.font)}
              fill={text.color}
              rotation={text.rotation}
              draggable
              onClick={() => setSelectedId('text')}
              onTap={() => setSelectedId('text')}
              onDragMove={handleTextDragMove}
              onDragEnd={handleTextDragEnd}
              onTransformEnd={handleTextTransformEnd}
              shadowColor="#10B981"
              shadowBlur={selectedId === 'text' ? 15 : 5}
              shadowOpacity={0.5}
              fontStyle="bold"
            />
          )}

          {/* Modern Transformer with dynamic colors */}
          <Transformer
            ref={transformerRef}
            boundBoxFunc={(oldBox, newBox) => {
              // Limit resize
              if (newBox.width < DESIGN_CONSTRAINTS.MIN_SIZE || newBox.height < DESIGN_CONSTRAINTS.MIN_SIZE) {
                return oldBox;
              }
              return newBox;
            }}
            // Dynamic colors based on selected element type
            borderStroke={selectedId === 'design' ? '#A855F7' : '#10B981'}
            borderStrokeWidth={4}
            borderDash={[]}
            // Modern circular anchors
            anchorStroke={selectedId === 'design' ? '#A855F7' : '#10B981'}
            anchorFill="#FFFFFF"
            anchorSize={16}
            anchorCornerRadius={8}
            anchorStrokeWidth={3}
            // Rotation anchor
            rotationSnaps={[0, 45, 90, 135, 180, 225, 270, 315]}
            rotateAnchorOffset={30}
            // Enable animations
            keepRatio={false}
            enabledAnchors={[
              'top-left',
              'top-right',
              'bottom-left',
              'bottom-right',
              'middle-left',
              'middle-right',
              'top-center',
              'bottom-center',
            ]}
          />
        </Layer>
      </Stage>

      {/* Instructions below canvas */}
      <div className="bg-blue-50 border-t-2 border-blue-400 p-3 text-center">
        <p className="text-sm font-bold text-blue-900">
          💡 Cliquez sur un élément pour le sélectionner • Glissez pour déplacer • Utilisez les poignées pour redimensionner
        </p>
      </div>
    </div>
  );
}
