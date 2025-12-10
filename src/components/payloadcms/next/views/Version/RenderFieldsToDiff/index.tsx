import { buildVersionFields, type BuildVersionFieldsArgs } from './buildVersionFields'
import { RenderVersionFieldsToDiff } from './RenderVersionFieldsToDiff'

export const RenderDiff = (args: BuildVersionFieldsArgs): React.ReactNode => {
  const { versionFields } = buildVersionFields(args)

  return <RenderVersionFieldsToDiff parent={true} versionFields={versionFields} />
}
