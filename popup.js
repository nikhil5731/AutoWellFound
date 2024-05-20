document.addEventListener("DOMContentLoaded", function () {
  var button = document.getElementById("myButton");
  var message = document.getElementById("message");
  var jobsFound = document.getElementById("jobsFound");
  const jobsAppliedElement = document.getElementById("appliedJobs");

  function saveRecursionState(state) {
    chrome.storage.local.set({ RecursionState: state }, function () {
      console.log("Recursion state saved:", state);
    });
  }

  async function startApplying() {
    saveRecursionState(false);
    let [tab] = await chrome.tabs.query({ active: true });
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: startJobApplicationProcess,
    });
  }

  async function startJobApplicationProcess() {
    let numberOfJobs = parseInt(
      document
        .getElementsByClassName("styles_header__ilUL3")[0]
        .innerText.split(" ")[0]
    );

    let numberOfScrollsRequired = Math.ceil(numberOfJobs / 10);

    function scrollToBottom() {
      chrome.storage.local.get("RecursionState", function (data) {
        if (data.RecursionState) {
          return;
        }
        let tempJobLinks = document.getElementsByClassName(
          "styles_component__uTjje"
        );
        if (
          tempJobLinks.length >= numberOfJobs ||
          numberOfScrollsRequired == 0
        ) {
          startApplication();
          return;
        }
        console.log({ 1: tempJobLinks.length, 2: numberOfScrollsRequired });
        window.scrollTo({
          top: document.body.scrollHeight,
          behavior: "smooth",
        });
        numberOfScrollsRequired--;
        setTimeout(() => {
          scrollToBottom();
        }, 4000);
      });
    }

    scrollToBottom();

    async function startApplication() {
      let jobLinks = document.getElementsByClassName("styles_jobLink__US40J");

      function clickJobLinkAndApply(index) {
        chrome.storage.local.get("RecursionState", function (data) {
          if (data.RecursionState) {
            return;
          }
          if (index >= numberOfJobs) {
            // All links processed, exit recursion
            return;
          }

          // Click on the job link
          jobLinks[index].click();

          // Wait for some time to ensure the modal opens
          setTimeout(() => {
            // Find and click the apply button within the modal
            fillTextarea(index, 0);
          }, 2000); // Adjust the time delay as needed
        });
      }

      function fillTextarea(index, time) {
        chrome.storage.local.get("RecursionState", function (data) {
          if (data.RecursionState) {
            return;
          }
          const textarea = document.getElementsByClassName(
            "styles-module_component__2Y90D text-dark-aaaa text-md max-w-full placeholder-dark-a ring-inset border rounded focus:ring-dark-link bg-white  focus:ring-1 px-3 py-2 h-10 border-gray-500 disabled:text-dark-a disabled:bg-gray-200 disabled:border-dark-aa w-full styles_component__kpbt6"
          )[0];

          if (textarea) {
            // Set the value of the textarea
            if (!textarea.disabled) {
              textarea.defaultValue =
                "As a Full Stack Developer with FixitAI and a B.Tech student at Delhi Technological University, I'm excited for the opportunities this internship will provide. I am confident in my ability to contribute to your team since I have practical abilities in HTML, CSS, JavaScript, MongoDB, ExpressJS, ReactJS, NodeJS (MERN stack), NextJS, and TypeScript, as well as a track record of delivering successful projects";
              textarea.value =
                "As a Full Stack Developer with FixitAI and a B.Tech student at Delhi Technological University, I'm excited for the opportunities this internship will provide. I am confident in my ability to contribute to your team since I have practical abilities in HTML, CSS, JavaScript, MongoDB, ExpressJS, ReactJS, NodeJS (MERN stack), NextJS, and TypeScript, as well as a track record of delivering successful projects"; // Change this to your desired message
              textarea.innerHTML =
                "As a Full Stack Developer with FixitAI and a B.Tech student at Delhi Technological University, I'm excited for the opportunities this internship will provide. I am confident in my ability to contribute to your team since I have practical abilities in HTML, CSS, JavaScript, MongoDB, ExpressJS, ReactJS, NodeJS (MERN stack), NextJS, and TypeScript, as well as a track record of delivering successful projects";
              textarea.innerText =
                "As a Full Stack Developer with FixitAI and a B.Tech student at Delhi Technological University, I'm excited for the opportunities this internship will provide. I am confident in my ability to contribute to your team since I have practical abilities in HTML, CSS, JavaScript, MongoDB, ExpressJS, ReactJS, NodeJS (MERN stack), NextJS, and TypeScript, as well as a track record of delivering successful projects";
            }

            // Wait for some time to ensure the textarea is filled
            setTimeout(() => {
              // Find and click the apply button within the modal
              clickApplyButton(index);
            }, 1000); // Adjust the time delay as needed
          } else {
            // Textarea not found, wait and try again
            if (time >= 10) {
              clickJobLinkAndApply(index + 1);
            }
            setTimeout(() => {
              fillTextarea(index, time + 1);
            }, 1000); // Adjust the time delay as needed
          }
        });
      }

      function clickApplyButton(index) {
        chrome.storage.local.get("RecursionState", function (data) {
          if (data.RecursionState) {
            return;
          }
          const applyButton = document.getElementsByClassName(
            "styles-module_component__88XzG w-full !bg-black !text-white styles_component__sMuDw rounded border-solid border gap-x-2 whitespace-nowrap font-medium antialiased text-center text-sm no-underline cursor-pointer focus:outline-0 disabled:cursor-default disabled:pointer-events-none disabled:opacity-50 transition duration-200 px-4 py-2 bg-black border-black text-white disabled:bg-gray-400 disabled:border-gray-400 disabled:text-gray-700 hover:bg-gtmblue-500 hover:border-gtmblue-500"
          )[0];
          const alreadySent = document.getElementsByClassName(
            "styles-module_component__88XzG w-full styles_component__sMuDw styles_medium__R1A06 styles_success__fDaJc rounded border-solid border gap-x-2 whitespace-nowrap font-medium antialiased text-center text-sm no-underline cursor-pointer focus:outline-0 disabled:cursor-default disabled:pointer-events-none disabled:opacity-50 transition duration-200 px-4 py-2 bg-black border-black text-white disabled:bg-gray-400 disabled:border-gray-400 disabled:text-gray-700 hover:bg-gtmblue-500 hover:border-gtmblue-500"
          )[0];

          if (applyButton) {
            // Wait for some time to ensure the application is processed
            // applyButton.click();
            chrome.storage.local.get("appliedJobsNumber", function (data) {
              let currentNumber = data.appliedJobsNumber || 0; // Default to 0 if no value is found

              // Update the value based on your requirement
              currentNumber = index + 1; // Adjust this based on your needs

              // Save the updated value back to local storage
              chrome.storage.local.set(
                { appliedJobsNumber: currentNumber },
                function () {
                  console.log("Applied jobs number updated to", currentNumber);
                }
              );
            });

            chrome.storage.local.get("appliedJobsNumber", function (data) {
              if (data.appliedJobsNumber) {
                const jobsApplied = parseInt(data.appliedJobsNumber);
                jobsAppliedElement.innerText =
                  jobsApplied + "/" + jobsFound + " Applied";
              }
            });

            setTimeout(() => {
              clickJobLinkAndApply(index + 1);
            }, 2000); // Adjust the time delay as needed
          } else {
            // Apply button not found, wait and try again
            if (alreadySent) {
              setTimeout(() => {
                clickJobLinkAndApply(index + 1);
              }, 2000); // Adjust the time delay as needed
            } else {
              setTimeout(() => {
                clickApplyButton(index);
              }, 1000); // Adjust the time delay as needed
            }
          }
        });
      }

      clickJobLinkAndApply(0);
    }
  }

  async function stopApplying() {
    saveRecursionState(true);
  }

  function saveButtonState(state) {
    chrome.storage.local.set({ buttonState: state }, function () {
      console.log("Button state saved:", state);
    });
  }

  function loadButtonState() {
    chrome.storage.local.get("buttonState", function (data) {
      if (data.buttonState) {
        button.innerText = data.buttonState;
        if (data.buttonState === "Stop Applying") {
          button.style.backgroundColor = "red";
        } else {
          button.style.backgroundColor = "green";
        }
      }
    });
  }

  function checkUrlAndToggleButton() {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      var activeTab = tabs[0];
      var url = new URL(activeTab.url);
      if (url.hostname.includes("wellfound.com/jobs")) {
        button.style.display = "block";
        message.style.display = "none";
      } else {
        button.style.display = "none";
        message.style.display = "block";
      }
      loadButtonState();
      updateJobsFound();
    });
  }

  async function updateJobsFound() {
    let [tab] = await chrome.tabs.query({ active: true });
    chrome.scripting.executeScript(
      {
        target: { tabId: tab.id },
        func: async () => {
          let numbersOfJobs = document
            .getElementsByClassName("styles_header__ilUL3")[0]
            .innerText.split(" ")[0];
          return numbersOfJobs;
        },
      },
      (results) => {
        if (results && results[0] && results[0].result) {
          jobsFound.innerText = results[0].result + " Jobs Found";
        }
      }
    );
  }

  button.addEventListener("click", function () {
    if (button.innerText === "Start Applying") {
      button.innerText = "Stop Applying";
      button.style.backgroundColor = "red";
      startApplying();
      saveButtonState("Stop Applying");
    } else {
      button.innerText = "Start Applying";
      button.style.backgroundColor = "green";
      stopApplying();
      saveButtonState("Start Applying");
    }
  });

  checkUrlAndToggleButton();
});
