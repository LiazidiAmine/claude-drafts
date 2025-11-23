'use client';

import { useEffect, useRef, useState } from 'react';
import { Stage, Layer, Image as KonvaImage, Text, Transformer, Rect } from 'react-konva';
import { useCustomizerStore } from '@/store/useCustomizerStore';
import { DESIGN_CONSTRAINTS, FONTS } from '@/lib/constants';
import Konva from 'konva';

interface DesignCanvasProps {
  className?: string;
}

export function DesignCanvas({ className }: DesignCanvasProps) {
  const { front, back, currentSide, updateDesign, updateText } = useCustomizerStore();

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [designImage, setDesignImage] = useState<HTMLImageElement | null>(null);

  const stageRef = useRef<Konva.Stage>(null);
  const imageRef = useRef<Konva.Image>(null);
  const textRef = useRef<Konva.Text>(null);
  const transformerRef = useRef<Konva.Transformer>(null);

  const currentCanvas = currentSide === 'front' ? front : back;
  const { design, text } = currentCanvas;

  // Load design image
  useEffect(() => {
    if (design?.imageUrl) {
      const img = new window.Image();
      img.src = design.imageUrl;
      img.onload = () => {
        setDesignImage(img);
      };
    } else {
      setDesignImage(null);
    }
  }, [design?.imageUrl]);

  // Attach transformer to selected element
  useEffect(() => {
    if (!transformerRef.current) return;

    if (selectedId === 'design' && imageRef.current) {
      transformerRef.current.nodes([imageRef.current]);
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
    if (!design || !imageRef.current) return;

    const node = imageRef.current;
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
    <div className={`border-2 border-gray-300 rounded-lg bg-white ${className}`}>
      <Stage
        ref={stageRef}
        width={DESIGN_CONSTRAINTS.CANVAS_WIDTH}
        height={DESIGN_CONSTRAINTS.CANVAS_HEIGHT}
        onClick={handleStageClick}
      >
        <Layer>
          {/* Print area guide */}
          <Rect
            x={(DESIGN_CONSTRAINTS.CANVAS_WIDTH - DESIGN_CONSTRAINTS.PRINT_AREA_WIDTH) / 2}
            y={(DESIGN_CONSTRAINTS.CANVAS_HEIGHT - DESIGN_CONSTRAINTS.PRINT_AREA_HEIGHT) / 2}
            width={DESIGN_CONSTRAINTS.PRINT_AREA_WIDTH}
            height={DESIGN_CONSTRAINTS.PRINT_AREA_HEIGHT}
            stroke="#E5E7EB"
            strokeWidth={2}
            dash={[5, 5]}
          />

          {/* Design image */}
          {design && designImage && (
            <KonvaImage
              ref={imageRef}
              image={designImage}
              x={design.x}
              y={design.y}
              width={design.width}
              height={design.height}
              rotation={design.rotation}
              draggable
              onClick={() => setSelectedId('design')}
              onTap={() => setSelectedId('design')}
              onDragEnd={handleDesignDragEnd}
              onTransformEnd={handleDesignTransformEnd}
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
          />
        </Layer>
      </Stage>
    </div>
  );
}
