export function generateSprite(sprite, colors, spriteScale = 10) {
  const height = sprite.length - 1;
  const boxShadow = sprite.reduce((r, line, y) => {
    let lineShadow = line.reduce(
      (l, colorIndex, x) =>
        (x === 0 && y === height) || colorIndex === -1
          ? l
          : l +
            `${x * spriteScale}px ${-(height - y) * spriteScale}px 0 0 ${
              colors[colorIndex]
            }, `,
      ''
    );
    return r + lineShadow;
  }, '');
  return {
    boxShadow: boxShadow.substring(0, boxShadow.length - 2),
    backgroundColor: sprite[height][0] === -1 ? '' : colors[sprite[height][0]],
    size: `${spriteScale}px`,
  };
}

export function renderSprite(object, sprite) {
  const { boxShadow, backgroundColor, size } = generateSprite(
    sprite,
    object.colors,
    object.spriteScale
  );
  object.element.style.height = size;
  object.element.style.width = size;
  object.element.style.boxShadow = boxShadow;
  object.element.style.backgroundColor = backgroundColor;
}
