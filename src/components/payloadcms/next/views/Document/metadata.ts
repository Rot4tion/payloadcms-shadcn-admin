import type { GenerateEditViewMetadata } from './getMetaBySegment'

import { getMetaBySegment } from './getMetaBySegment'

export const generateDocumentViewMetadata: GenerateEditViewMetadata = async (args) =>
  getMetaBySegment(args)
