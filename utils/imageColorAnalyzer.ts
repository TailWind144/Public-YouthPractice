/**
 * 图片颜色分析工具
 * 用于分析图片的主要颜色并计算相应的深色背景
 */

interface RGBColor {
  r: number
  g: number
  b: number
}

interface DominantColor {
  color: RGBColor
  count: number
}

/**
 * 从图片URL获取主要颜色
 * @param imageUrl 图片URL
 * @returns Promise<RGBColor> 主要颜色
 */
export async function getDominantColor(imageUrl: string): Promise<RGBColor> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = "anonymous"

    img.onload = () => {
      try {
        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d")

        if (!ctx) {
          reject(new Error("无法创建canvas上下文"))
          return
        }

        // 设置canvas尺寸，为了性能考虑，可以缩小图片
        const maxSize = 300
        const scale = Math.min(maxSize / img.width, maxSize / img.height)
        canvas.width = img.width * scale
        canvas.height = img.height * scale

        // 绘制图片到canvas
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

        // 获取图片数据
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const pixels = imageData.data
        const width = canvas.width
        const height = canvas.height

        // 使用更精细的颜色量化
        const colorMap = new Map<string, { color: RGBColor; weight: number }>()

        // 采样分析，每2个像素取一个
        for (let i = 0; i < pixels.length; i += 8) {
          const pixelIndex = i / 4
          const x = pixelIndex % width
          const y = Math.floor(pixelIndex / width)

          const r = pixels[i]
          const g = pixels[i + 1]
          const b = pixels[i + 2]
          const alpha = pixels[i + 3]

          // 跳过透明或接近透明的像素
          if (alpha < 200) continue

          // 跳过过于接近白色或黑色的像素（可能是背景或噪点）
          const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
          if (luminance > 0.95 || luminance < 0.05) continue

          // 更精细的颜色量化（16步长）
          const quantizedR = Math.floor(r / 16) * 16
          const quantizedG = Math.floor(g / 16) * 16
          const quantizedB = Math.floor(b / 16) * 16

          const colorKey = `${quantizedR},${quantizedG},${quantizedB}`

          // 计算权重：中心区域权重更高
          const centerX = width / 2
          const centerY = height / 2
          const distanceFromCenter = Math.sqrt(
            Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2)
          )
          const maxDistance = Math.sqrt(
            Math.pow(width / 2, 2) + Math.pow(height / 2, 2)
          )
          const centerWeight = 1 - distanceFromCenter / maxDistance

          // 饱和度权重：更饱和的颜色权重更高
          const max = Math.max(r, g, b)
          const min = Math.min(r, g, b)
          const saturation = max === 0 ? 0 : (max - min) / max
          const saturationWeight = saturation * 2 // 增强饱和度权重

          const totalWeight = centerWeight * (1 + saturationWeight)

          if (colorMap.has(colorKey)) {
            colorMap.get(colorKey)!.weight += totalWeight
          } else {
            colorMap.set(colorKey, {
              color: { r: quantizedR, g: quantizedG, b: quantizedB },
              weight: totalWeight,
            })
          }
        }

        // 找到权重最高的颜色
        let dominantColor: DominantColor = {
          color: { r: 0, g: 0, b: 0 },
          count: 0,
        }

        for (const [colorKey, data] of colorMap) {
          if (data.weight > dominantColor.count) {
            dominantColor = { color: data.color, count: data.weight }
          }
        }

        // 如果没找到合适的颜色，使用平均颜色作为备选
        if (dominantColor.count === 0) {
          let totalR = 0
          let totalG = 0
          let totalB = 0
          let pixelCount = 0

          for (let i = 0; i < pixels.length; i += 8) {
            const r = pixels[i]
            const g = pixels[i + 1]
            const b = pixels[i + 2]
            const alpha = pixels[i + 3]

            if (alpha > 200) {
              totalR += r
              totalG += g
              totalB += b
              pixelCount++
            }
          }

          if (pixelCount > 0) {
            dominantColor = {
              color: {
                r: Math.floor(totalR / pixelCount),
                g: Math.floor(totalG / pixelCount),
                b: Math.floor(totalB / pixelCount),
              },
              count: 1,
            }
          }
        }

        resolve(dominantColor.color)
      } catch (error) {
        reject(error)
      }
    }

    img.onerror = () => {
      reject(new Error("图片加载失败"))
    }

    img.src = imageUrl
  })
}

/**
 * 根据主要颜色计算深色背景
 * @param dominantColor 主要颜色
 * @returns RGBColor 深色背景颜色
 */
export function calculateDarkBackground(dominantColor: RGBColor): RGBColor {
  const { r, g, b } = dominantColor

  // 计算颜色的亮度 (使用相对亮度公式)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255

  // 计算颜色的饱和度
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const saturation = max === 0 ? 0 : (max - min) / max

  // 如果主要颜色已经很暗，使用更智能的处理
  if (luminance < 0.4) {
    // 如果是接近黑色的颜色，使用深灰色调而不是纯黑
    if (luminance < 0.15) {
      // 对于非常暗的颜色，使用深灰色作为背景
      const grayValue = Math.floor(255 * 0.12) // 约30的灰色值
      return {
        r: grayValue,
        g: grayValue,
        b: grayValue,
      }
    } else {
      // 对于中等暗度的颜色，适当调亮
      return {
        r: Math.max(20, Math.floor(r * 0.6)), // 确保最小值
        g: Math.max(20, Math.floor(g * 0.6)),
        b: Math.max(20, Math.floor(b * 0.6)),
      }
    }
  }

  // 对于中等亮度的颜色，使用HSL调整
  if (luminance < 0.7) {
    // 降低亮度，保持色调，但确保不会太暗
    const factor = Math.max(0.25, 0.4 - luminance * 0.2) // 动态调整因子
    return {
      r: Math.max(15, Math.floor(r * factor)), // 确保最小值
      g: Math.max(15, Math.floor(g * factor)),
      b: Math.max(15, Math.floor(b * factor)),
    }
  }

  // 对于高亮度的颜色，使用更智能的补色计算
  if (saturation > 0.3) {
    // 高饱和度颜色：使用补色并调暗
    const complementR = 255 - r
    const complementG = 255 - g
    const complementB = 255 - b

    // 根据原色亮度调整补色的暗化程度
    const darkenFactor = Math.max(0.15, 0.4 - luminance * 0.3)

    return {
      r: Math.floor(complementR * darkenFactor),
      g: Math.floor(complementG * darkenFactor),
      b: Math.floor(complementB * darkenFactor),
    }
  } else {
    // 低饱和度颜色（接近灰色）：使用更暗的灰色调
    const avgValue = (r + g + b) / 3
    // 根据原色亮度调整灰色背景的亮度
    let grayValue
    if (avgValue < 50) {
      // 原色很暗时，使用稍亮的灰色
      grayValue = Math.floor(255 * 0.15) // 约38
    } else if (avgValue < 150) {
      // 中等亮度时，使用适中的灰色
      grayValue = Math.floor(255 * 0.12) // 约30
    } else {
      // 原色较亮时，使用较暗的灰色
      grayValue = Math.floor(255 * 0.08) // 约20
    }

    return {
      r: grayValue,
      g: grayValue,
      b: grayValue,
    }
  }
}

/**
 * RGB颜色转换为CSS颜色字符串
 * @param color RGB颜色对象
 * @returns CSS颜色字符串
 */
export function rgbToCss(color: RGBColor): string {
  return `rgb(${color.r}, ${color.g}, ${color.b})`
}

/**
 * 分析图片并返回深色背景CSS颜色
 * @param imageUrl 图片URL
 * @param debug 是否输出调试信息
 * @returns Promise<string> CSS颜色字符串
 */
export async function getDarkBackgroundFromImage(
  imageUrl: string,
  debug: boolean = false
): Promise<string> {
  try {
    const dominantColor = await getDominantColor(imageUrl)
    const darkBackground = calculateDarkBackground(dominantColor)

    if (debug) {
      console.log("🎨 颜色分析结果:", {
        原始图片: imageUrl,
        主要颜色: rgbToCss(dominantColor),
        背景颜色: rgbToCss(darkBackground),
        主要颜色RGB: dominantColor,
        背景颜色RGB: darkBackground,
      })
    }

    return rgbToCss(darkBackground)
  } catch (error) {
    console.error("分析图片颜色失败:", error)
    // 返回默认的深色背景
    return "rgb(15, 23, 42)" // slate-900
  }
}
