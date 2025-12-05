// Tab switching functionality
document.addEventListener('DOMContentLoaded', () => {
	const switchButtons = document.querySelectorAll('.switch-btn');
	const tabPanes = document.querySelectorAll('.tab-pane');

	switchButtons.forEach(button => {
		button.addEventListener('click', () => {
			const targetTab = button.getAttribute('data-tab');

			// Remove active class from all buttons and panes
			switchButtons.forEach(btn => btn.classList.remove('active'));
			tabPanes.forEach(pane => pane.classList.remove('active'));

			// Add active class to clicked button and corresponding pane
			button.classList.add('active');
			document.getElementById(targetTab).classList.add('active');
		});
	});
});
