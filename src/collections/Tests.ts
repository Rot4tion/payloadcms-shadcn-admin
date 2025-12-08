import {
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import type { CollectionConfig } from 'payload'

export const Tests: CollectionConfig = {
  slug: 'tests',
  access: {
    read: ({ req }) => {
      // If there is a user logged in, allow reading drafts
      if (req.user) return true
      // Otherwise, only allow reading published documents
      return {
        _status: {
          equals: 'published',
        },
      }
    },
  },
  admin: {
    useAsTitle: 'text',
    livePreview: {
      url: ({ data }) => {
        return `${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'}/tests/${data.id}`
      },
    },
    preview: (data) => {
      return `${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'}/tests/${data.id}`
    },
  },
  versions: {
    drafts: {
      autosave: {
        interval: 1000, // Autosave every second
      },
    },
  },
  fields: [
    // ===== TEXT FIELDS =====
    {
      name: 'text',
      type: 'text',
      required: true,
    },
    {
      name: 'textWithMinMax',
      type: 'text',
      minLength: 5,
      maxLength: 20,
      admin: {
        description: 'Min 5, Max 20 characters',
      },
    },
    {
      name: 'textarea',
      type: 'textarea',
    },
    {
      name: 'textareaRequired',
      type: 'textarea',
      required: true,
      minLength: 10,
      admin: {
        description: 'Required, min 10 characters',
      },
    },
    {
      name: 'locale',
      type: 'text',
      localized: true,
    },
    {
      name: 'email',
      type: 'email',
      required: true,
    },
    {
      name: 'code',
      type: 'code',
      admin: {
        language: 'javascript',
      },
    },
    {
      name: 'richText',
      type: 'richText',
      editor: lexicalEditor({
        features({ defaultFeatures, rootFeatures }) {
          return [
            ...defaultFeatures,
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
            HorizontalRuleFeature(),
          ]
        },
      }),
    },
    // ===== NUMBER FIELDS =====
    {
      name: 'number',
      type: 'number',
    },
    {
      name: 'numberRequired',
      type: 'number',
      required: true,
      admin: {
        description: 'Required number field',
      },
    },
    {
      name: 'numberWithMinMax',
      type: 'number',
      min: 1,
      max: 100,
      admin: {
        description: 'Min 1, Max 100',
      },
    },

    // ===== DATE FIELDS =====
    {
      name: 'date',
      type: 'date',
    },
    {
      name: 'dateWithTime',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },

    // ===== BOOLEAN =====
    {
      name: 'checkbox',
      type: 'checkbox',
    },

    // ===== SELECTION FIELDS =====
    {
      name: 'select',
      type: 'select',
      options: [
        { label: 'Option A', value: 'optionA' },
        { label: 'Option B', value: 'optionB' },
        { label: 'Option C', value: 'optionC' },
      ],
    },
    {
      name: 'selectRequired',
      type: 'select',
      required: true,
      options: [
        { label: 'Required A', value: 'reqA' },
        { label: 'Required B', value: 'reqB' },
      ],
      admin: {
        description: 'Required select field',
      },
    },
    {
      name: 'selectMultiple',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'Tag 1', value: 'tag1' },
        { label: 'Tag 2', value: 'tag2' },
        { label: 'Tag 3', value: 'tag3' },
        { label: 'Tag 4', value: 'tag4' },
        { label: 'Tag 5', value: 'tag5' },
      ],
    },
    {
      name: 'radio',
      type: 'radio',
      options: [
        { label: 'Option 1', value: 'option1' },
        { label: 'Option 2', value: 'option2' },
        { label: 'Option 3', value: 'option3' },
      ],
    },
    {
      name: 'radioRequired',
      type: 'radio',
      required: true,
      options: [
        { label: 'Yes', value: 'yes' },
        { label: 'No', value: 'no' },
      ],
      admin: {
        description: 'Required radio field',
      },
    },
    {
      name: 'checkboxRequired',
      type: 'checkbox',
      required: true,
      admin: {
        description: 'Must be checked',
      },
    },

    // ===== DATA FIELDS =====
    {
      name: 'json',
      type: 'json',
    },
    // NOTE: 'point' field requires PostGIS extension on PostgreSQL
    // Uncomment if you have PostGIS installed:
    // {
    //   name: 'point',
    //   type: 'point',
    // },

    // ===== RELATIONSHIP FIELDS =====
    {
      name: 'relationship',
      type: 'relationship',
      relationTo: 'users',
    },
    {
      name: 'relationshipMany',
      type: 'relationship',
      relationTo: 'users',
      hasMany: true,
    },
    {
      name: 'upload',
      type: 'upload',
      relationTo: 'media',
    },

    // ===== ARRAY =====
    {
      name: 'array',
      type: 'array',
      fields: [
        {
          name: 'arrayText',
          type: 'text',
        },
        {
          name: 'arrayNumber',
          type: 'number',
        },
      ],
    },
    {
      name: 'arrayWithMinMax',
      type: 'array',
      minRows: 1,
      maxRows: 3,
      admin: {
        description: 'Min 1, Max 3 rows',
      },
      fields: [
        {
          name: 'itemName',
          type: 'text',
          required: true,
        },
      ],
    },

    // ===== BLOCKS =====
    {
      name: 'blocks',
      type: 'blocks',
      blocks: [
        {
          slug: 'textBlock',
          fields: [
            {
              name: 'blockText',
              type: 'text',
            },
          ],
        },
        {
          slug: 'imageBlock',
          fields: [
            {
              name: 'blockImage',
              type: 'upload',
              relationTo: 'media',
            },
            {
              name: 'blockCaption',
              type: 'text',
            },
          ],
        },
      ],
    },

    // ===== GROUP =====
    {
      name: 'group',
      type: 'group',
      fields: [
        {
          name: 'groupText',
          type: 'text',
        },
        {
          name: 'groupNumber',
          type: 'number',
        },
      ],
    },

    // ===== ROW (side by side fields) =====
    {
      type: 'row',
      fields: [
        {
          name: 'rowField1',
          type: 'text',
        },
        {
          name: 'rowField2',
          type: 'text',
        },
      ],
    },

    // ===== COLLAPSIBLE =====
    {
      type: 'collapsible',
      label: 'Collapsible Section',
      fields: [
        {
          name: 'collapsibleText',
          type: 'text',
        },
        {
          name: 'collapsibleTextarea',
          type: 'textarea',
        },
      ],
    },

    // ===== TABS =====
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Tab 1',
          fields: [
            {
              name: 'tab1Text',
              type: 'text',
            },
          ],
        },
        {
          label: 'Tab 2',
          fields: [
            {
              name: 'tab2Text',
              type: 'text',
            },
            {
              name: 'tab2Number',
              type: 'number',
            },
          ],
        },
      ],
    },

    // ===== LAYOUT CONFIG TESTS =====

    // --- Field Width Variations ---
    {
      type: 'row',
      fields: [
        {
          name: 'widthFull',
          type: 'text',
          admin: {
            width: '100%',
            description: 'Full width (100%)',
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'widthHalf1',
          type: 'text',
          admin: {
            width: '50%',
            description: 'Half width (50%)',
          },
        },
        {
          name: 'widthHalf2',
          type: 'text',
          admin: {
            width: '50%',
            description: 'Half width (50%)',
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'widthThird1',
          type: 'text',
          admin: {
            width: '33%',
            description: '1/3 width',
          },
        },
        {
          name: 'widthThird2',
          type: 'text',
          admin: {
            width: '33%',
            description: '1/3 width',
          },
        },
        {
          name: 'widthThird3',
          type: 'text',
          admin: {
            width: '33%',
            description: '1/3 width',
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'widthQuarter1',
          type: 'text',
          admin: {
            width: '25%',
            description: '1/4 width',
          },
        },
        {
          name: 'widthQuarter2',
          type: 'text',
          admin: {
            width: '25%',
            description: '1/4 width',
          },
        },
        {
          name: 'widthQuarter3',
          type: 'text',
          admin: {
            width: '25%',
            description: '1/4 width',
          },
        },
        {
          name: 'widthQuarter4',
          type: 'text',
          admin: {
            width: '25%',
            description: '1/4 width',
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'widthMixed1',
          type: 'text',
          admin: {
            width: '70%',
            description: '70% width',
          },
        },
        {
          name: 'widthMixed2',
          type: 'text',
          admin: {
            width: '30%',
            description: '30% width',
          },
        },
      ],
    },

    // --- Sidebar Position ---
    {
      name: 'sidebarField',
      type: 'text',
      admin: {
        position: 'sidebar',
        description: 'This field appears in sidebar',
      },
    },
    {
      name: 'sidebarSelect',
      type: 'select',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
        { label: 'Archived', value: 'archived' },
      ],
      admin: {
        position: 'sidebar',
        description: 'Status in sidebar',
      },
    },
    {
      name: 'sidebarCheckbox',
      type: 'checkbox',
      admin: {
        position: 'sidebar',
        description: 'Featured toggle in sidebar',
      },
    },
    {
      name: 'sidebarDate',
      type: 'date',
      admin: {
        position: 'sidebar',
        description: 'Publish date in sidebar',
      },
    },

    // --- Conditional Fields ---
    {
      name: 'showConditional',
      type: 'checkbox',
      admin: {
        description: 'Check to show conditional fields below',
      },
    },
    {
      name: 'conditionalText',
      type: 'text',
      admin: {
        condition: (data) => data.showConditional === true,
        description: 'This field only shows when checkbox above is checked',
      },
    },
    {
      name: 'conditionalSelect',
      type: 'select',
      options: [
        { label: 'Conditional A', value: 'condA' },
        { label: 'Conditional B', value: 'condB' },
      ],
      admin: {
        condition: (data) => data.showConditional === true,
        description: 'Conditional select field',
      },
    },
    {
      type: 'collapsible',
      label: 'Conditional Collapsible',
      admin: {
        condition: (data) => data.showConditional === true,
      },
      fields: [
        {
          name: 'conditionalCollapsibleText',
          type: 'text',
        },
      ],
    },

    // --- Read Only Fields ---
    {
      name: 'readOnlyText',
      type: 'text',
      defaultValue: 'This is read only',
      admin: {
        readOnly: true,
        description: 'Read only text field',
      },
    },
    {
      name: 'readOnlyNumber',
      type: 'number',
      defaultValue: 42,
      admin: {
        readOnly: true,
        description: 'Read only number field',
      },
    },
    {
      name: 'readOnlySelect',
      type: 'select',
      defaultValue: 'optionA',
      options: [
        { label: 'Option A', value: 'optionA' },
        { label: 'Option B', value: 'optionB' },
      ],
      admin: {
        readOnly: true,
        description: 'Read only select field',
      },
    },

    // --- Hidden Fields ---
    {
      name: 'hiddenField',
      type: 'text',
      defaultValue: 'hidden value',
      admin: {
        hidden: true,
        description: 'This field is hidden in admin',
      },
    },

    // --- Custom Styles ---
    {
      name: 'styledField',
      type: 'text',
      admin: {
        style: {
          backgroundColor: '#f0f9ff',
        },
        description: 'Field with custom styles',
      },
    },
    {
      name: 'customClassField',
      type: 'text',
      admin: {
        className: 'custom-test-class',
        description: 'Field with custom className',
      },
    },

    // --- Disabled Fields ---
    {
      name: 'disabledText',
      type: 'text',
      admin: {
        disabled: true,
        description: 'Disabled text field',
      },
    },

    // --- Placeholder ---
    {
      name: 'placeholderText',
      type: 'text',
      admin: {
        placeholder: 'Enter your text here...',
        description: 'Field with placeholder',
      },
    },
    {
      name: 'placeholderTextarea',
      type: 'textarea',
      admin: {
        placeholder: 'Write a long description here...',
        description: 'Textarea with placeholder',
      },
    },

    // --- Nested Collapsibles ---
    {
      type: 'collapsible',
      label: 'Outer Collapsible',
      admin: {
        initCollapsed: false,
      },
      fields: [
        {
          name: 'outerText',
          type: 'text',
        },
        {
          type: 'collapsible',
          label: 'Inner Collapsible 1',
          admin: {
            initCollapsed: true,
          },
          fields: [
            {
              name: 'innerText1',
              type: 'text',
            },
            {
              name: 'innerNumber1',
              type: 'number',
            },
          ],
        },
        {
          type: 'collapsible',
          label: 'Inner Collapsible 2',
          admin: {
            initCollapsed: true,
          },
          fields: [
            {
              name: 'innerText2',
              type: 'text',
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'innerRowField1',
                  type: 'text',
                  admin: { width: '50%' },
                },
                {
                  name: 'innerRowField2',
                  type: 'text',
                  admin: { width: '50%' },
                },
              ],
            },
          ],
        },
      ],
    },

    // --- Nested Tabs ---
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Layout Tab',
          description: 'Tab with layout fields',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'layoutTabField1',
                  type: 'text',
                  admin: { width: '50%' },
                },
                {
                  name: 'layoutTabField2',
                  type: 'text',
                  admin: { width: '50%' },
                },
              ],
            },
            {
              type: 'collapsible',
              label: 'Collapsible in Tab',
              fields: [
                {
                  name: 'tabCollapsibleText',
                  type: 'text',
                },
              ],
            },
          ],
        },
        {
          label: 'Nested Tab',
          description: 'Tab with nested tabs',
          fields: [
            {
              type: 'tabs',
              tabs: [
                {
                  label: 'Sub Tab A',
                  fields: [
                    {
                      name: 'subTabAText',
                      type: 'text',
                    },
                  ],
                },
                {
                  label: 'Sub Tab B',
                  fields: [
                    {
                      name: 'subTabBText',
                      type: 'text',
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Named Tab',
          name: 'namedTab',
          fields: [
            {
              name: 'namedTabField',
              type: 'text',
              admin: {
                description: 'This tab has a name property',
              },
            },
          ],
        },
      ],
    },

    // --- Complex Group with Layout ---
    {
      name: 'layoutGroup',
      type: 'group',
      admin: {
        description: 'Group with complex layout inside',
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'groupRowField1',
              type: 'text',
              admin: { width: '33%' },
            },
            {
              name: 'groupRowField2',
              type: 'text',
              admin: { width: '33%' },
            },
            {
              name: 'groupRowField3',
              type: 'text',
              admin: { width: '33%' },
            },
          ],
        },
        {
          type: 'collapsible',
          label: 'Group Collapsible',
          fields: [
            {
              name: 'groupCollapsibleText',
              type: 'textarea',
            },
          ],
        },
      ],
    },

    // --- Array with Layout ---
    {
      name: 'layoutArray',
      type: 'array',
      admin: {
        description: 'Array with complex layout in each row',
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'arrayLayoutField1',
              type: 'text',
              admin: { width: '40%' },
            },
            {
              name: 'arrayLayoutField2',
              type: 'number',
              admin: { width: '30%' },
            },
            {
              name: 'arrayLayoutField3',
              type: 'select',
              options: [
                { label: 'Active', value: 'active' },
                { label: 'Inactive', value: 'inactive' },
              ],
              admin: { width: '30%' },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'arrayCheckbox1',
              type: 'checkbox',
              admin: { width: '33%' },
            },
            {
              name: 'arrayCheckbox2',
              type: 'checkbox',
              admin: { width: '33%' },
            },
            {
              name: 'arrayCheckbox3',
              type: 'checkbox',
              admin: { width: '33%' },
            },
          ],
        },
        {
          type: 'collapsible',
          label: 'Array Item Details',
          admin: {
            initCollapsed: true,
          },
          fields: [
            {
              name: 'arrayItemDetails',
              type: 'textarea',
            },
          ],
        },
      ],
    },

    // --- Blocks with Layout ---
    {
      name: 'layoutBlocks',
      type: 'blocks',
      admin: {
        description: 'Blocks with various layouts',
      },
      blocks: [
        {
          slug: 'twoColumnBlock',
          labels: {
            singular: 'Two Column Block',
            plural: 'Two Column Blocks',
          },
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'leftColumn',
                  type: 'textarea',
                  admin: { width: '50%' },
                },
                {
                  name: 'rightColumn',
                  type: 'textarea',
                  admin: { width: '50%' },
                },
              ],
            },
          ],
        },
        {
          slug: 'threeColumnBlock',
          labels: {
            singular: 'Three Column Block',
            plural: 'Three Column Blocks',
          },
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'col1',
                  type: 'text',
                  admin: { width: '33%' },
                },
                {
                  name: 'col2',
                  type: 'text',
                  admin: { width: '33%' },
                },
                {
                  name: 'col3',
                  type: 'text',
                  admin: { width: '33%' },
                },
              ],
            },
          ],
        },
        {
          slug: 'collapsibleBlock',
          labels: {
            singular: 'Collapsible Block',
            plural: 'Collapsible Blocks',
          },
          fields: [
            {
              name: 'blockTitle',
              type: 'text',
            },
            {
              type: 'collapsible',
              label: 'Block Content',
              fields: [
                {
                  name: 'blockContent',
                  type: 'richText',
                },
              ],
            },
          ],
        },
        {
          slug: 'tabbedBlock',
          labels: {
            singular: 'Tabbed Block',
            plural: 'Tabbed Blocks',
          },
          fields: [
            {
              type: 'tabs',
              tabs: [
                {
                  label: 'Content',
                  fields: [
                    {
                      name: 'tabbedContent',
                      type: 'textarea',
                    },
                  ],
                },
                {
                  label: 'Settings',
                  fields: [
                    {
                      name: 'tabbedSettings',
                      type: 'json',
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },

    // --- UI Field ---
    // Commented out - requires a proper component path string, not inline function
    // {
    //   name: 'uiDivider',
    //   type: 'ui',
    //   admin: {
    //     components: {
    //       Field: '@/components/UIDivider#UIDivider',
    //     },
    //   },
    // },

    // --- Auto-complete ---
    {
      name: 'autoCompleteText',
      type: 'text',
      admin: {
        autoComplete: 'email',
        description: 'Text with autoComplete=email',
      },
    },
  ],
}
