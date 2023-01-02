import type { ToolBaseData } from '../Tool/types.ts'
import type { TShirtSizingTool } from './index.ts'

export type TShirtSizingToolBaseData = ToolBaseData & {
  reveal: TShirtSizingTool['reveal']
}
