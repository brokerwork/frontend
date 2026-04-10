import React from "react";
import { configure, setAddon } from "@storybook/react";
import chaptersAddon, { setDefaults } from "react-storybook-addon-chapters";
import { configure as configureAsEnzyme } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

configureAsEnzyme({ adapter: new Adapter() });

function loadStories() {
  require("../stories/index.js");
}

setDefaults({
  sectionOptions: {
    showSource: false,
    allowSourceToggling: true,
    showPropTables: true,
    allowPropTablesToggling: true
  }
});

setAddon(chaptersAddon);

configure(loadStories, module);
