// src/components/common/biteGraphStyles.js

export const styles = {
  width: 500,
  height: 300,
  padding: {
    top: 40,
    right: 60,
    bottom: 40,
    left: 60
  }
}

export const dataHeight =
  styles.height - styles.padding.top - styles.padding.bottom
export const dataWidth =
  styles.width - styles.padding.left - styles.padding.right
