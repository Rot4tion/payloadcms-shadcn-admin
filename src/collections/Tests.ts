import type { CollectionConfig } from 'payload'

export const Tests: CollectionConfig = {
  slug: 'Tests',
  access: {
    read: () => true,
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
    // NOTE: richText field causes context conflict with shadcn-admin
    // Use /admin route to test richText, or uncomment when using standard admin
    // {
    //   name: 'richText',
    //   type: 'richText',
    // },

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
  ],
}
