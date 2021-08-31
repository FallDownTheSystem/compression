const defaultTheme = require('tailwindcss/defaultTheme');
const plugin = require('tailwindcss/plugin');
// Loading all the tailwind colors, rather than just the defaults
let colors = require('tailwindcss/colors');

// Depricated but still included. Deleted to get rid of the warning from Tailwind.
delete colors.lightBlue;

module.exports = {
	mode: 'jit',
	purge: ['./index.html', './src/**/*.{js,vue}'],
	darkMode: false, // or 'media' or 'class'
	theme: {
		extend: {
			colors: {
				gray: colors.blueGray,
				...colors
			},
			// Change tailwind default sans font-family to Inter
			fontFamily: {
				sans: ['Inter', ...defaultTheme.fontFamily.sans]
			}
		}
	},
	variants: {
		extend: {}
	},
	plugins: [require('@tailwindcss/forms')]
};
