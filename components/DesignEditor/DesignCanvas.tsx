'use client';

import { useEffect, useRef, useState } from 'react';
import { Stage, Layer, Text, Transformer, Rect, Group } from 'react-konva';
import { useCustomizerStore } from '@/store/useCustomizerStore';
import { DESIGN_CONSTRAINTS, FONTS } from '@/lib/constants';
import Konva from 'konva';

interface DesignCanvasProps {
  className?: string;
}

export function DesignCanvas({ className }: DesignCanvasProps) {
  const { front, back, currentSide, updateDesign, updateText } = useCustomizerStore();

  const [selectedId, setSelectedId] = useState<string | null>(null);

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

  const handleDesignDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
    if (!design) return;
    updateDesign({
      x: e.target.x(),
      y: e.target.y(),
    });
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

  const handleTextDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
    if (!text) return;
    updateText({
      x: e.target.x(),
      y: e.target.y(),
    });
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

  const handleStageClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
    // Deselect when clicking on empty area
    if (e.target === e.target.getStage()) {
      setSelectedId(null);
    }
  };

  const getFontFamily = (font: string) => {
    const fontConfig = FONTS.find(f => f.value === font);
    return fontConfig?.fontFamily || 'Arial, sans-serif';
  };

  return (
    <div className={`border-4 border-blue-400 rounded-lg bg-white shadow-lg ${className}`}>
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

          {/* T-Shirt Silhouette */}
          <Group listening={false}>
            {/* Main body */}
            <Rect
              x={75}
              y={80}
              width={250}
              height={350}
              fill="#FFFFFF"
              stroke="#D1D5DB"
              strokeWidth={2}
              cornerRadius={[10, 10, 15, 15]}
            />

            {/* Left sleeve */}
            <Rect
              x={30}
              y={80}
              width={50}
              height={120}
              fill="#FFFFFF"
              stroke="#D1D5DB"
              strokeWidth={2}
              cornerRadius={[8, 0, 0, 8]}
            />

            {/* Right sleeve */}
            <Rect
              x={320}
              y={80}
              width={50}
              height={120}
              fill="#FFFFFF"
              stroke="#D1D5DB"
              strokeWidth={2}
              cornerRadius={[0, 8, 8, 0]}
            />

            {/* Collar/Neck - V shape */}
            <Rect
              x={175}
              y={70}
              width={50}
              height={30}
              fill="#FFFFFF"
              stroke="#D1D5DB"
              strokeWidth={2}
              cornerRadius={[5, 5, 0, 0]}
            />

            {/* Label on silhouette */}
            <Text
              text="T-SHIRT"
              x={DESIGN_CONSTRAINTS.CANVAS_WIDTH / 2}
              y={420}
              fontSize={10}
              fontFamily="Arial"
              fill="#9CA3AF"
              align="center"
              offsetX={25}
              fontStyle="bold"
            />
          </Group>

          {/* Print area guide */}
          <Rect
            x={(DESIGN_CONSTRAINTS.CANVAS_WIDTH - DESIGN_CONSTRAINTS.PRINT_AREA_WIDTH) / 2}
            y={(DESIGN_CONSTRAINTS.CANVAS_HEIGHT - DESIGN_CONSTRAINTS.PRINT_AREA_HEIGHT) / 2}
            width={DESIGN_CONSTRAINTS.PRINT_AREA_WIDTH}
            height={DESIGN_CONSTRAINTS.PRINT_AREA_HEIGHT}
            stroke="#93C5FD"
            strokeWidth={3}
            dash={[10, 5]}
          />

          {/* Helper text for print area */}
          <Text
            text="Zone d'impression"
            x={DESIGN_CONSTRAINTS.CANVAS_WIDTH / 2}
            y={(DESIGN_CONSTRAINTS.CANVAS_HEIGHT - DESIGN_CONSTRAINTS.PRINT_AREA_HEIGHT) / 2 - 20}
            fontSize={12}
            fontFamily="Arial"
            fill="#60A5FA"
            fontStyle="bold"
            align="center"
            offsetX={60}
          />

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
              onDragEnd={handleTextDragEnd}
              onTransformEnd={handleTextTransformEnd}
              shadowColor="#10B981"
              shadowBlur={selectedId === 'text' ? 15 : 5}
              shadowOpacity={0.5}
              fontStyle="bold"
            />
          )}

          {/* Transformer */}
          <Transformer
            ref={transformerRef}
            boundBoxFunc={(oldBox, newBox) => {
              // Limit resize
              if (newBox.width < DESIGN_CONSTRAINTS.MIN_SIZE || newBox.height < DESIGN_CONSTRAINTS.MIN_SIZE) {
                return oldBox;
              }
              return newBox;
            }}
            borderStroke="#3B82F6"
            borderStrokeWidth={3}
            anchorStroke="#3B82F6"
            anchorFill="#FFFFFF"
            anchorSize={12}
            anchorCornerRadius={6}
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
