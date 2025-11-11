```poml
<component_spec>
  <metadata>
    <component_name>{{component_name}}</component_name>
    <package_entry>{{import_path}}</package_entry>
    <description>
      {{one_sentence_summary}}
    </description>
    <status>{{draft|stable|deprecated}}</status>
    <owner>{{team_or_individual}}</owner>
    <last_updated>{{YYYY-MM-DD}}</last_updated>
  </metadata>

  <props>
    <!-- Repeat <prop> block per prop -->
    <prop>
      <name>{{prop_name}}</name>
      <type>{{TypeScript_type_signature}}</type>
      <required>{{true|false}}</required>
      <default>{{default_value_or_none}}</default>
      <description>{{short_usage_notes}}</description>
    </prop>
  </props>

  <design_tokens>
    <!-- List Tailwind/CSS tokens used internally -->
    <token>{{token_name_or_css_variable}}</token>
  </design_tokens>

  <dependencies>
    <!-- List internal/external dependencies -->
    <dependency>{{import_path_or_library}}</dependency>
  </dependencies>

  <usage>
    <import_snippet>
      <![CDATA[
import { {{component_name}} } from "{{import_path}}";
      ]]>
    </import_snippet>
    <example_snippet>
      <![CDATA[
<{{component_name}}
  {{prop_name}}={{{prop_value}}}
/>
      ]]>
    </example_snippet>
    <notes>
      {{integration_tips_or_edge_cases}}
    </notes>
  </usage>

  <testing>
    <strategy>{{unit|visual|interaction}}</strategy>
    <grep>{{preferred_test_path_or_command}}</grep>
  </testing>

  <changelog>
    <!-- Append entries as the component evolves -->
    <entry>
      <date>{{YYYY-MM-DD}}</date>
      <summary>{{change_summary}}</summary>
      <author>{{name_or_alias}}</author>
    </entry>
  </changelog>
</component_spec>
```




