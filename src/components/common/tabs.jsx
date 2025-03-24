import { Box, Tabs as MuiTabs, Tab } from "@mui/material";
import PropTypes from "prop-types";
import React from "react";

/**
 * Custom TabPanel component
 */
function TabPanel({ children, value, index, ...props }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...props}
    >
      {value === index && <Box className="py-4">{children}</Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

/**
 * Function to generate a11y props for tabs
 */
function a11yProps(index) {
  return {
    id: `tab-${index}`,
    "aria-controls": `tabpanel-${index}`,
  };
}

/**
 * Custom Tabs component that wraps Material UI Tabs with additional styling options
 * @param {Object} props - Component props
 * @param {Array} props.tabs - Array of tab definitions with { label, content, icon, disabled }
 * @param {number} props.value - Current active tab index
 * @param {function} props.onChange - Tab change handler
 * @param {string} props.orientation - Tab orientation: 'horizontal', 'vertical'
 * @param {string} props.variant - Tab variant: 'standard', 'fullWidth', 'scrollable'
 * @param {string} props.indicatorColor - Indicator color: 'primary', 'secondary'
 * @param {string} props.textColor - Text color: 'primary', 'secondary'
 * @param {string} props.className - Additional Tailwind classes
 * @param {string} props.tabsClassName - Additional Tailwind classes for tabs
 * @param {string} props.panelClassName - Additional Tailwind classes for panels
 */
const Tabs = ({
  tabs = [],
  value,
  onChange,
  orientation = "horizontal",
  variant = "standard",
  indicatorColor = "primary",
  textColor = "primary",
  className = "",
  tabsClassName = "",
  panelClassName = "",
  ...props
}) => {
  const handleChange = (event, newValue) => {
    onChange(newValue);
  };

  return (
    <div className={className}>
      <Box className={orientation === "vertical" ? "flex" : ""}>
        <Box className={orientation === "vertical" ? "border-r pr-4" : ""}>
          <MuiTabs
            orientation={orientation}
            variant={variant}
            value={value}
            onChange={handleChange}
            indicatorColor={indicatorColor}
            textColor={textColor}
            className={tabsClassName}
            {...props}
          >
            {tabs.map((tab, index) => (
              <Tab
                key={index}
                label={tab.label}
                icon={tab.icon}
                iconPosition={tab.iconPosition || "start"}
                disabled={tab.disabled}
                {...a11yProps(index)}
              />
            ))}
          </MuiTabs>
        </Box>

        <Box
          className={`flex-grow ${orientation === "vertical" ? "pl-4" : ""}`}
        >
          {tabs.map((tab, index) => (
            <TabPanel
              key={index}
              value={value}
              index={index}
              className={panelClassName}
            >
              {tab.content}
            </TabPanel>
          ))}
        </Box>
      </Box>
    </div>
  );
};

Tabs.propTypes = {
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      content: PropTypes.node.isRequired,
      icon: PropTypes.node,
      iconPosition: PropTypes.oneOf(["start", "end", "top", "bottom"]),
      disabled: PropTypes.bool,
    })
  ).isRequired,
  value: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  orientation: PropTypes.oneOf(["horizontal", "vertical"]),
  variant: PropTypes.oneOf(["standard", "fullWidth", "scrollable"]),
  indicatorColor: PropTypes.oneOf(["primary", "secondary"]),
  textColor: PropTypes.oneOf(["primary", "secondary", "inherit"]),
  className: PropTypes.string,
  tabsClassName: PropTypes.string,
  panelClassName: PropTypes.string,
};

export default Tabs;
