/** IMPORTS
 * Importing required icon assets for the user interface of the extension.
 */
import AIIcon from "~/assets/AI.svg";
import DownArrowIcon from "~/assets/DownArrow.svg";
import RightArrowIcon from "~/assets/RightArrow.svg";
import RegenerateIcon from "~/assets/Regenerate.svg";

/** CONTENT SCRIPT DEFINITION
 * Defines the main content script that runs on LinkedIn pages.
 * Specifies the URLs where this script should execute.
 */
export default defineContentScript({
  matches: ["*://*.linkedin.com/*"],
  main() {
    /** MODAL HTML TEMPLATE
     * Template for the modal that will be displayed on the page.
     * Contains a semi-transparent background overlay,
     * a white content box with rounded corners, a section to display messages,
     * an input field for user prompts, and buttons for inserting and generating messages.
     */
    const AIModalHtml = `
      <div id="ai-modal" style="position: fixed; inset: 0; background: rgba(0, 0, 0, 0.5); display: none; justify-content: center; align-items: center; z-index: 4000;">
        <div id="modal-content" style="background: #f9fafb; border-radius: 8px; width: 100%; max-width: 570px; padding: 15px; font-family: 'Inter', sans-serif;">
           <div id="messages" style="max-height: 200px; overflow-y: auto; display: flex; flex-direction: column;"></div>
          <div style="margin-bottom: 10px;">
            <input id="user-prompt-input" type="text" placeholder="Your prompt" style="width: 100%; padding: 8px; margin-top: 10px; box-shadow: inset 0 0 0 1px #C1C7D0; border-radius: 4px;"/>
          </div>
          <div style="text-align: right; margin-top: 12px;">
            <button id="insert-btn" style="background: #fff; color: #666D80; padding: 8px 16px; border: 1px solid #666D80; border-radius: 4px; cursor: pointer; display: none; margin-right: 10px;">
              <img src="${DownArrowIcon}" alt="Insert" style="vertical-align: middle; margin: 0 5px 2px 0; width: 14px; height: 10px;"> 
              <b>Insert</b>
            </button>
            <button id="generate-btn" style="background: #007bff; color: white; padding: 8px 16px; border-radius: 4px; cursor: pointer;">
              <img src="${RightArrowIcon}" alt="Generate" style="vertical-align: middle; margin-right: 5px; width: 14px; height: 14px"> 
              <b>Generate</b>
            </button>
          </div>
        </div>
      </div>
    `;

    /** APPEND MODAL TO BODY
     * Appends the modal HTML to the end of the document body
     * to make it part of the page.
     */
    document.body.insertAdjacentHTML("beforeend", AIModalHtml);

    /** CACHING MODAL ELEMENTS
     * Caches modal elements for easier access later.
     */
    const modal = document.getElementById("ai-modal") as HTMLDivElement;
    const generateMessageButton = document.getElementById("generate-btn") as HTMLButtonElement;
    const insertMessageButton = document.getElementById("insert-btn") as HTMLButtonElement;
    const userPrompt = document.getElementById("user-prompt-input") as HTMLInputElement;
    const messagesContainer = document.getElementById("messages") as HTMLDivElement;

    /** STATE VARIABLES
     * Variables to store the last generated message and
     * the parent message input area for insertion.
     */
    let lastGeneratedMessage = "";
    let parentElement: HTMLElement | null = null;

    /** HELPER FUNCTIONS
     * Functions to manage AI icon visibility and interaction
     */
    const removeAIIcon = (element: HTMLElement) => {
      const existingIcon = element.querySelector('.edit-icon') as HTMLElement;
      if (existingIcon) {
        existingIcon.remove();
      }
    };

    const addAIIcon = (element: HTMLElement) => {
      if (!element.querySelector('.edit-icon')) {
        element.style.position = "relative";
        const icon = document.createElement("img");
        icon.className = "edit-icon";
        icon.src = AIIcon;
        icon.alt = "Custom Icon";
        Object.assign(icon.style, {
          position: "absolute",
          bottom: "5px",
          right: "5px",
          width: "30px",
          height: "30px",
          cursor: "pointer",
          zIndex: "1000"
        });
        
        icon.addEventListener("click", (e) => {
          e.stopPropagation();
          modal.style.display = "flex";
        });
        
        element.appendChild(icon);
      }
    };

    /** EVENT LISTENERS
     * Event listeners for handling user interactions
     */
    document.addEventListener("click", (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const messageInput = target.matches(".msg-form__contenteditable") || target.closest(".msg-form__contenteditable");
      
      if (messageInput) {
        const messageContainer = (target.closest(".msg-form__container") || target.closest(".msg-form__contenteditable")) as HTMLElement | null;
        if (messageContainer) {
          parentElement = messageContainer;
          parentElement.setAttribute("data-artdeco-is-focused", "true");
          addAIIcon(parentElement);
        }
      } else if (!target.closest("#ai-modal") && parentElement) {
        removeAIIcon(parentElement);
        parentElement.setAttribute("data-artdeco-is-focused", "false");
      }
    });

    document.addEventListener("focusin", (event: FocusEvent) => {
      const target = event.target as HTMLElement;
      if (target.matches(".msg-form__contenteditable") || target.closest(".msg-form__contenteditable")) {
        const messageContainer = (target.closest(".msg-form__container") || target.closest(".msg-form__contenteditable")) as HTMLElement | null;
        if (messageContainer) {
          addAIIcon(messageContainer);
        }
      }
    });

    document.addEventListener("focusout", (event: FocusEvent) => {
      const target = event.target as HTMLElement;
      const relatedTarget = event.relatedTarget as HTMLElement | null;
      
      if (relatedTarget?.closest("#ai-modal")) return;

      if (target.matches(".msg-form__contenteditable") || target.closest(".msg-form__contenteditable")) {
        const messageContainer = (target.closest(".msg-form__container") || target.closest(".msg-form__contenteditable")) as HTMLElement | null;
        if (messageContainer) {
          removeAIIcon(messageContainer);
        }
      }
    });

    /** DEFAULT MESSAGE GENERATOR
     * Function to create a default message for the user.
     */
    const generateMessage = () => {
      return "Thank you for the opportunity! If you have any more questions or if there's anything else I can help you with, feel free to ask.";
    };

    /** GENERATE BUTTON EVENT LISTENER
     * Event listener for the generate button.
     * Trims user input, generates a default message,
     * displays it, shows the insert button, and clears the input field.
     */
    generateMessageButton.addEventListener("click", (e) => {
      e.stopPropagation();

      const inputValue = userPrompt.value.trim();
      if (!inputValue) return;

      const userMessageDiv = document.createElement("div");
      userMessageDiv.textContent = inputValue;
      Object.assign(userMessageDiv.style, {
        backgroundColor: "#DFE1E7",
        color: "#666D80",
        borderRadius: "12px",
        padding: "10px",
        marginBottom: "5px",
        textAlign: "right",
        maxWidth: "80%",
        alignSelf: "flex-end",
        marginLeft: "auto"
      });
      messagesContainer.appendChild(userMessageDiv);

      generateMessageButton.disabled = true;
      generateMessageButton.textContent = "Loading...";
      generateMessageButton.style.backgroundColor = "#666D80";

      setTimeout(() => {
        lastGeneratedMessage = generateMessage();
        const generatedMessageDiv = document.createElement("div");
        generatedMessageDiv.textContent = lastGeneratedMessage;
        Object.assign(generatedMessageDiv.style, {
          backgroundColor: "#DBEAFE",
          color: "#666D80",
          borderRadius: "12px",
          padding: "10px",
          marginBottom: "5px",
          textAlign: "left",
          maxWidth: "80%",
          alignSelf: "flex-start",
          marginRight: "auto"
        });

        messagesContainer.appendChild(generatedMessageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        generateMessageButton.disabled = false;
        generateMessageButton.style.backgroundColor = "#007bff";
        generateMessageButton.style.color = "white";
        generateMessageButton.innerHTML = `<img src="${RegenerateIcon}" alt="Regenerate" style="vertical-align: middle; margin-right: 5px; width: 16px; height: 16px"> <b>Regenerate</b>`;

        userPrompt.value = "";
        insertMessageButton.style.display = "inline-block";
      }, 500);
    });

    /** INSERT BUTTON EVENT LISTENER
     * Event listener for the insert button.
     * Inserts the last generated message into the input area.
     */
    insertMessageButton.addEventListener("click", () => {
      if (lastGeneratedMessage && parentElement) {
        parentElement.innerHTML = "";
        const p = document.createElement("p");
        p.textContent = lastGeneratedMessage;
        parentElement.appendChild(p);

        parentElement.dispatchEvent(new Event("input", { bubbles: true, cancelable: true }));
        parentElement.focus();

        insertMessageButton.style.display = "none";
        modal.style.display = "none";
      }
    });

    /** CLOSE MODAL ON OUTSIDE CLICK
     * Closing the modal when clicking outside of it.
     */
    modal.addEventListener("click", (event: MouseEvent) => {
      if (event.target === modal) {
        modal.style.display = "none";
      }
    });
  },
});