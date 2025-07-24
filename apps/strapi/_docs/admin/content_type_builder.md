Content-type Builder

From the Content-type Builder, accessible via the main navigation of the admin panel, users can create and edit their content types.
IDENTITY CARD
Role & permission
Minimum "Read" permission in Roles > Plugins - Content Type Builder.
Environment
Available in Development environment only.
Overview
Content Type Builder updates Beta

Interface modifications and new options are available in the Content-type Builder, including:

    tags to indicate the status of the fields and content types: "N" for new, "M" for modified and "D" for deleted,
    an * beside required fields in the list view,
    a drag & drop button in the list view, to reorder the fields,
    and collapse button for dynamic zones and components.

The Save button has also been moved to the Content-type Builder navigation which lists all content types and components. This, along with the status tags, allows you to work on several content types and components at the same time. Revert, Undo and Discard changes button have also been added, which also work globally on all content types and components.

The Content-type Builder allows the creation and management of content-types, which can be:

    Collection types: content-types that can manage several entries.
    Single types: content-types that can only manage one entry.
    Components: content structure that can be used in multiple collection types and single types. Although they are technically not proper content-types because they cannot exist independently, components are also created and managed through the Content-type Builder, in the same way as collection and single types.

All 3 are displayed as categories in the sub navigation of the Content-type Builder. In each category are listed all content-types and components that have already been created.
Tip

Click the search icon in the Content-type Builder sub navigation to find a specific collection type, single type, or component.
Usage
Creating content-types

The Content-type Builder allows to create new content-types: single and collection types, but also components.
New content-type Content-type creation

    Choose whether you want to create a collection type or a single type.
    In the Content-type Builder's category of the content-type you want to create, click on Create new collection/single type.
    In the content-type creation window, write the name of the new content-type in the Display name textbox.
    Check the API ID to make sure the automatically pre-filled values are correct. Collection type names are indeed automatically pluralized when displayed in the Content Manager. It is recommended to opt for singular names, but the API ID field allows to fix any pluralization mistake.
    (optional) In the Advanced Settings tab, configure the available settings for the new content-type:
    Setting name	Instructions
    Draft & publish	Tick the checkbox to allow entries of the content-type to be managed as draft versions, before they are published (see Draft & Publish).
    Internationalization	Tick the checkbox to allow entries of the content-type to be translated into other locales.
    Click on the Continue button.
    Add and configure chosen fields for your content-type (see Configuring fields for content-types).
    Click on the Save button.

Caution

New content-types are only considered created once they have been saved. Saving is only possible if at least one field has been added and properly configured. If these steps have not been done, a content-type cannot be created, listed in its category in the Content-type Builder, and cannot be used in the Content Manager.
New component Component creation

    In the Components category of the Content-type Builder sub navigation, click on Create new component.
    In the component creation window, configure the base settings of the new component:
        Write the name of the component in the Display name textbox.
        Select an available category, or enter in the textbox a new category name to create one.
        (optional) Choose an icon representing the new component. You can use the search to find an icon instead of scrolling through the list.
    Click on the Continue button.
    Add and configure chosen fields for your component (see Configuring fields for content-types).
    Click on the Save button.

Editing content-types

The Content-type Builder allows to manage all existing content-types. For an chosen content-type or component to edit, the right side of the Content-type Builder interface displays all available editing and management options.
Content-type Builder's edition interface

    Click on the Add new/another field button 1 in the top right corner to add more fields to your content-type.

    In the table that displays the fields of your content-type 2, click on the and/or buttons to respectively edit and/or delete these fields.

    Click on the Edit button 3 to access the basic and advanced settings of your content-type:
        Basic settings
        Advanced settings

    The Basic Settings tab allows to edit the following properties of the content-type or component:
    Content-type Builder's basic settings
        Display name: Name of the content-type or component as it will be displayed in the admin panel.
        API ID (singular): Name of the content-type or component as it will be used in the API. It is automatically generated from the display name, but can be edited.
        API ID (plural): Plural name of the content-type or component as it will be used in the API. It is automatically generated from the display name, but can be edited.
        Type: Type of the content-type or component. It can be either a Collection type or a Single type.

    Click on the Save button 4 to confirm any ongoing modification.

Caution

Editing a field allows renaming it. However, keep in mind that regarding the database, renaming a field means creating a whole new field and deleting the former one. Although nothing is deleted from the database, the data that was associated with the former field name will not be accessible from the admin panel of your application anymore.
Configuring content-types fields

Content-types are composed of one or several fields. Each field is designed to contain specific kind of data, filled up in the Content Manager (see Creating & Writing content).

In the Content-type Builder, fields can be added at the creation of a new content-type or component, or afterward when a content-type or component is edited or updated.
Note

Depending on what content-type or component is being created or edited, not all fields -including components and dynamic zones- are always available.
Fields selection Text

The Text field displays a textbox that can contain small text. This field can be used for titles, descriptions, etc.

    Base settings
    Advanced settings

Setting name	Instructions
Name	Write the name of the Text field.
Type	Choose between Short text (255 characters maximum) and Long text, to allow more or less space to fill up the Text field.
Rich Text (Blocks)

The Rich Text (Blocks) field displays an editor with live rendering and various options to manage rich text. This field can be used for long written content, even including images and code.

    Base settings
    Advanced settings

Setting name	Instructions
Name	Write the name of the Rich Text (Blocks) field.
React renderer

If using the Blocks editor, we recommend that you also use the Strapi Blocks React Renderer to easily render the content in a React frontend.
Number

The Number field displays a field for any kind of number: integer, decimal and float.

    Base settings
    Advanced settings

Setting name	Instructions
Name	Write the name of the Number field.
Number format	Choose between integer, big integer, decimal and float.
Date

The Date field can display a date (year, month, day), time (hour, minute, second) or datetime (year, month, day, hour, minute, and second) picker.

    Base settings
    Advanced settings

Setting name	Instructions
Name	Write the name of the Date field.
Type	Choose between date, datetime and time
Password

The Password field displays a password field that is encrypted.

    Base settings
    Advanced settings

Setting name	Instructions
Name	Write the name of the Password field.
Media

The Media field allows to choose one or more media files (e.g. image, video) from those uploaded in the Media Library of the application.

    Base settings
    Advanced settings

Setting name	Instructions
Name	Write the name of the Media field.
Type	Choose between Multiple media to allow multiple media uploads, and Single media to only allow one media upload.
Relation

The Relation field allows to establish a relation with another content-type, that must be a collection type.

There are 6 different types of relations:

    One way: Content-type A has one Content-type B
    One-to-one: Content-type A has and belong to one Content-type B
    One-to-many: Content-type A belongs to many Content-type B
    Many-to-one: Content-type B has many Content-type A
    Many-to-many: Content-type A has and belongs to many Content-type B
    Many way: Content-type A has many Content-type B

    Base settings
    Advanced settings

Configuring the base settings of the Relation field consists in choosing with which existing content-type the relation should be established and the kind of relation. The edition window of the Relation field displays 2 grey boxes, each representing one of the content-types in relation. Between the grey boxes are displayed all possible relation types.

    Click on the 2nd grey box to define the content-type B. It must be an already created collection type.
    Click on the icon representing the relation to establish between the content-types.
    Choose the Field name of the content-type A, meaning the name that will be used for the field in the content-type A.
    (optional if disabled by the relation type) Choose the Field name of the content-type B.

Boolean

The Boolean field displays a toggle button to manage boolean values (e.g. Yes or No, 1 or 0, True or False).

    Base settings
    Advanced settings

Setting name	Instructions
Name	Write the name of the Boolean field.
JSON

The JSON field allows to configure data in a JSON format, to store JSON objects or arrays.

    Base settings
    Advanced settings

Setting name	Instructions
Name	Write the name of the JSON field.
Email

The Email field displays an email address field with format validation to ensure the email address is valid.

    Base settings
    Advanced settings

Setting name	Instructions
Name	Write the name of the Email field.
Password

The Password field displays a password field that is encrypted.

    Base settings
    Advanced settings

Setting name	Instructions
Name	Write the name of the Password field.
Enumeration

The Enumeration field allows to configure a list of values displayed in a drop-down list.

    Base settings
    Advanced settings

Setting name	Instructions
Name	Write the name of the Enumeration field.
Values	Write the values of the enumeration, one per line.
Caution

Enumeration values should always have an alphabetical character preceding any number as it could otherwise cause the server to crash without notice when the GraphQL plugin is installed.
UID

The UID field displays a field that sets a unique identifier, optionally based on an existing other field from the same content-type.

    Base settings
    Advanced settings

Setting name	Instructions
Name	Write the name of the UID field. It must not contain special characters or spaces.
Attached field	Choose what existing field to attach to the UID field. Choose None to not attach any specific field.
Tip

The UID field can be used to create a slug based on the Attached field.
Rich Text (Markdown)

The Rich Text (Markdown) field displays an editor with basic formatting options to manage rich text written in Markdown. This field can be used for long written content.

    Base settings
    Advanced settings

Setting name	Instructions
Name	Write the name of the Rich Text (Markdown) field.
Components

Components are a combination of several fields. Components allow to create reusable sets of fields, that can be quickly added to content-types, dynamic zones but also nested into other components.

When configuring a component through the Content-type Builder, it is possible to either:

    create a new component by clicking on Create a new component (see Creating a new component),
    or use an existing one by clicking on Use an existing component.

    Base settings
    Advanced settings

Setting name	Instructions
Name	Write the name of the component for the content-type.
Select a component	When using an existing component only - Select from the drop-down list an existing component.
Type	Choose between Repeatable component to be able to use several times the component for the content-type, or Single component to limit to only one time the use of the component.
Dynamic zones

Dynamic zones are a combination of components that can be added to content-types. They allow a flexible content structure as once in the Content Manager, administrators have the choice of composing and rearranging the components of the dynamic zone how they want.

    Base settings
    Advanced settings

Setting name	Instructions
Name	Write the name of the dynamic zone for the content-type.

After configuring the settings of the dynamic zone, its components must be configured as well. It is possible to either choose an existing component or create a new one.
Caution

When using dynamic zones, different components cannot have the same field name with different types (or with enumeration fields, different values).
Custom fields

Custom fields are a way to extend Strapi’s capabilities by adding new types of fields to content-types or components. Once installed (see Marketplace documentation), custom fields are listed in the Custom tab when selecting a field for a content-type.

Each custom field type can have basic and advanced settings. The Marketplace lists available custom fields, and hosts dedicated documentation for each custom field, including specific settings.
Deleting content-types

Content types and components can be deleted through the Content-type Builder. Deleting a content-type automatically deletes all entries from the Content Manager that were based on that content-type. The same goes for the deletion of a component, which is automatically deleted from every content-type or entry where it was used.

    In the Content-type Builder sub navigation, click on the name of the content-type or component to delete.
    In the edition interface of the chosen content-type or component, click on the Edit button on the right side of the content-type's or component's name.
    In the edition window, click on the Delete button.
    In the confirmation window, confirm the deletion.

Caution

Deleting a content-type only deletes what was created and available from the Content-type Builder, and by extent from the admin panel of your Strapi application. All the data that was created based on that content-type is however kept in the database. For more information, please refer to the related GitHub issue.
Deletion of content type in Content-type Builder
Tags:

    admin panelcontent type buildercontent typescomponentdynamic zonecustom field