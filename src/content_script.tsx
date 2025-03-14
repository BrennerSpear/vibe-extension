chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
	if (msg.color) {
		console.log(`Receive color = ${msg.color}`);
		document.body.style.backgroundColor = msg.color;
		sendResponse(`Change color to ${msg.color}`);
	} else if (msg.action === "fillPrompt") {
		const { prompt, inputSelector, submitSelector } = msg;
		console.log(`Attempting to fill prompt: ${prompt.substring(0, 20)}...`);

		// Find the input field
		let inputElement: HTMLElement | null = null;
		try {
			console.log("Debug - Current URL:", window.location.href);

			inputElement = document.querySelector(inputSelector);

			if (!inputElement) {
				console.error(
					`Input element not found with selector: ${inputSelector}`,
				);
				sendResponse({ success: false, error: "Input element not found" });
				return;
			}

			// Focus the input element
			inputElement.focus();

			// Set the value for standard inputs
			if (
				inputElement instanceof HTMLInputElement ||
				inputElement instanceof HTMLTextAreaElement
			) {
				// Set value directly
				inputElement.value = prompt;

				// Trigger input event to simulate user typing
				const inputEvent = new Event("input", { bubbles: true });
				inputElement.dispatchEvent(inputEvent);

				// Trigger change event
				const changeEvent = new Event("change", { bubbles: true });
				inputElement.dispatchEvent(changeEvent);
			} else {
				// For contenteditable elements
				if (inputElement.isContentEditable) {
					console.log("Debug - Found contenteditable element:", inputElement);

					// Try multiple approaches for contenteditable elements

					// Approach 1: Using textContent
					console.log("Debug - Trying textContent approach");
					// Clear existing content
					inputElement.textContent = "";

					// Insert new content
					inputElement.textContent = prompt;

					// Approach 2: Using innerHTML (some rich text editors use this)
					console.log("Debug - Trying innerHTML approach");
					inputElement.innerHTML = prompt;

					// Approach 3: Selection and execCommand approach
					console.log("Debug - Trying selection/execCommand approach");
					// Create a range and selection
					const range = document.createRange();
					range.selectNodeContents(inputElement);
					const selection = window.getSelection();
					if (selection) {
						selection.removeAllRanges();
						selection.addRange(range);

						// Use execCommand to insert text
						document.execCommand("insertText", false, prompt);
					}

					// Approach 4: Direct event simulation
					console.log("Debug - Trying keyboard event simulation");
					// Focus the element first
					inputElement.focus();

					// Create input and keydown events to simulate typing
					try {
						const inputEvent = new InputEvent("input", {
							bubbles: true,
							cancelable: true,
							data: prompt,
						});
						inputElement.dispatchEvent(inputEvent);
					} catch (e) {
						console.log("Debug - Error creating InputEvent:", e);

						// Fallback for browsers without InputEvent constructor
						const simpleInputEvent = new Event("input", { bubbles: true });
						inputElement.dispatchEvent(simpleInputEvent);
					}

					const changeEvent = new Event("change", { bubbles: true });
					inputElement.dispatchEvent(changeEvent);

					// For CodeMirror editors (like in Replit)
					if (inputElement.closest(".cm-editor")) {
						console.log(
							"Debug - Detected CodeMirror editor, using specialized approach",
						);
						// Try to find the actual CM editor instance
						const cmEditor = inputElement.closest(".cm-editor");
						if (cmEditor) {
							// Create and dispatch a custom input event
							cmEditor.dispatchEvent(new Event("input", { bubbles: true }));

							// Focus the editor area
							const cmContent = cmEditor.querySelector(".cm-content");
							if (cmContent instanceof HTMLElement) {
								cmContent.focus();
							}
						}
					}
				} else {
					// Try setting innerText as a fallback
					inputElement.innerText = prompt;
					inputElement.dispatchEvent(new Event("input", { bubbles: true }));
					inputElement.dispatchEvent(new Event("change", { bubbles: true }));
				}
			}

			// Added keyboard event simulation as a last resort
			try {
				console.log("Debug - Trying to simulate keystrokes directly");

				// Focus the target element one more time
				inputElement.focus();

				// Split the prompt into individual characters
				const chars = prompt.split("");

				// Simulate pressing each key
				for (const char of chars) {
					// Create and dispatch keyboard events
					const keydownEvent = new KeyboardEvent("keydown", {
						key: char,
						code: `Key${char.toUpperCase()}`,
						bubbles: true,
						cancelable: true,
					});

					const keypressEvent = new KeyboardEvent("keypress", {
						key: char,
						code: `Key${char.toUpperCase()}`,
						bubbles: true,
						cancelable: true,
					});

					const keyupEvent = new KeyboardEvent("keyup", {
						key: char,
						code: `Key${char.toUpperCase()}`,
						bubbles: true,
						cancelable: true,
					});

					// Dispatch the events in sequence
					inputElement.dispatchEvent(keydownEvent);
					inputElement.dispatchEvent(keypressEvent);
					inputElement.dispatchEvent(keyupEvent);
				}
			} catch (e) {
				console.log("Debug - Error simulating key events:", e);
			}

			// Try to submit if a submit selector is provided
			if (submitSelector) {
				setTimeout(() => {
					const submitButton = document.querySelector(
						submitSelector,
					) as HTMLElement;
					if (submitButton) {
						// Check if button is disabled and handle if needed
						if (
							submitButton.hasAttribute("disabled") ||
							submitButton.getAttribute("data-disabled") === "true" ||
							submitButton.classList.contains("disabled")
						) {
							console.log("Submit button is disabled, attempting to enable it");

							// Remove disabled attribute
							submitButton.removeAttribute("disabled");
							submitButton.setAttribute("data-disabled", "false");

							// Remove disabled classes - handle common patterns
							submitButton.classList.remove("disabled");

							// For Replit specifically (or similar sites with React)
							if (window.location.hostname.includes("replit.com")) {
								// Remove React's disabled property via property descriptor
								if (Object.getOwnPropertyDescriptor(submitButton, "disabled")) {
									Object.defineProperty(submitButton, "disabled", {
										value: false,
										writable: true,
									});
								}
							}
						}

						// Click the button
						submitButton.click();
						console.log("Submit button clicked");
					} else {
						console.warn(
							`Submit button not found with selector: ${submitSelector}`,
						);
					}
				}, 500);
			}

			sendResponse({ success: true });
		} catch (error: unknown) {
			console.error("Error filling prompt:", error);
			sendResponse({
				success: false,
				error: error instanceof Error ? error.message : String(error),
			});
		}
	} else {
		sendResponse("Message not recognized");
	}

	// Return true to indicate you wish to send a response asynchronously
	return true;
});
