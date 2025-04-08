import { marked } from "https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js";

/**
 * @template T
 * @param {string} selector 
 * @param {new () => T} [type] 
 * @returns {T | null} 
 */
const $ = (selector, type) =>
  type
    ? /**@type {T | null} */ (document.querySelector(selector))
    : document.querySelector(selector);

const clearBtn = $("#clear-btn", HTMLButtonElement);
const submitBtn = $("#submit-btn", HTMLButtonElement);
const contentArea = $("#note", HTMLTextAreaElement);
const wordCounter = $("#word-counter", HTMLSpanElement);
const title = $("#title-name", HTMLInputElement);
const display = $("#display", HTMLDivElement);
const noteList = $("#note-list", HTMLDivElement);
const editBtn = $("#edit", HTMLButtonElement);

const savedStorage = localStorage.getItem("N-key") ?? "[]";
const notes = JSON.parse(savedStorage);

let sessionNote = {
  title: sessionStorage.getItem("T-key") ?? "",
  wordCount: sessionStorage.getItem("C-key") ?? 0,
  content: sessionStorage.getItem("N-key") ?? "",
};

if (sessionNote.title === "" && sessionNote.wordCount === 0 && sessionNote.content === "") {
  display.hidden = true;
  contentArea.hidden = false;
}

wordCounter.textContent = sessionNote.wordCount;
title.value = sessionNote.title;
display.innerHTML = marked(sessionNote.content);

console.log(notes);

clearBtn.addEventListener("click", () => {
  display.hidden = true;
  contentArea.hidden = false;
  contentArea.value = title.value = "";
  wordCounter.textContent = '0';
  sessionNote = {
    title: "",
    wordCount: 0,
    content: "",
  }

});

title.addEventListener("input", () =>
  sessionStorage.setItem("T-key", title.value)
);

submitBtn.addEventListener("click", () => {
  const note = {
    title: title.value,
    content: contentArea.value,
  };

  const isDuplicate = notes.some((existingNote) => existingNote.title === note.title);

  if (isDuplicate) {
    alert("A note with this title already exists. Please use a different title.");
    return; 
  }

  notes.push(note);
  localStorage.setItem("N-key", JSON.stringify(notes));
  renderSidebarNotes();
});

contentArea.addEventListener("input", () => {
  const value = contentArea.value;
  const countWord = (wordCounter.textContent =
    value.trim() === ""
      ? 0
      : value
        .trim()
        .split(/\s+/)
        .filter((val) => /\w+/g.test(val)).length);

  sessionStorage.setItem("N-key", value);
  sessionStorage.setItem("C-key", countWord);
});

editBtn.addEventListener("click", () => {
  display.hidden = true;
  contentArea.hidden = false;
  contentArea.value = sessionNote.content;
})

// Render saved notes into the sidebar
function renderSidebarNotes() {
  if (!noteList || notes.length === 0) return;


  noteList.innerHTML = "";

  // Display each saved note
  notes.forEach((note, index) => {
    const item = document.createElement("button");
    item.textContent = note.title || `Untitled #${index + 1}`;
    item.className = "sidebar-note";
    item.addEventListener("click", () => {
      sessionNote.title = title.value = note.title;
      sessionNote.content = note.content;
      sessionNote.wordCount = wordCounter.textContent =
        note.content.trim() === ""
          ? 0
          : note.content
            .trim()
            .split(/\s+/)
            .filter((val) => /\w+/g.test(val)).length;

      display.innerHTML = marked(note.content);
    });
    noteList.appendChild(item);
  });
}

renderSidebarNotes();
