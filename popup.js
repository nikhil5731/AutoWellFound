document.addEventListener("DOMContentLoaded", function () {
  var StartResetButton = document.getElementById("StartReset");
  var ResumePauseButton = document.getElementById("ResumePause");
  var message = document.getElementById("message");
  var jobsFound = document.getElementById("jobsFound");
  const jobsAppliedElement = document.getElementById("appliedJobs");
  var scrollMessage = document.getElementById("scrollToBottom");

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "showScrollMessage") {
      scrollMessage.style.display = "block";
      jobsFound.style.display = "none";
      jobsAppliedElement.style.display = "none";
    } else if (message.action === "hideScrollMessage") {
      scrollMessage.style.display = "none";
      jobsFound.style.display = "block";
      jobsAppliedElement.style.display = "block";
    } else if (message.action === "updateAppliedJobsInExtensionHTML") {
      chrome.storage.local.get("jobs", function (data) {
        if (data.jobs) {
          const jobsApplied = data.jobs.length;
          jobsAppliedElement.innerText =
            jobsApplied + "/" + jobsFound.innerText.split(" ")[0] + " Applied";
        }
      });
    } else if (message.action === "completedApplying") {
      jobsAppliedElement.innerText = "Completed!";
      jobsAppliedElement.style.color = "green";
      jobsAppliedElement.style.fontWeight = "900";
    }
  });

  function saveRecursionState(state) {
    chrome.storage.local.set({ RecursionState: state }, function () {
      console.log("Recursion state saved:", state);
    });
  }

  async function startJobApplicationProcess(startIndex, type) {
    let numberOfJobs = parseInt(
      document
        .getElementsByClassName("styles_header__ilUL3")[0]
        .innerText.split(" ")[0]
    );

    let numberOfScrollsRequired = Math.ceil(numberOfJobs / 10);

    function scrollToBottom() {
      chrome.storage.local.get("RecursionState", function (data) {
        if (data.RecursionState) {
          chrome.runtime.sendMessage({ action: "hideScrollMessage" });
          return;
        }

        let tempJobLinks = document.getElementsByClassName(
          "styles_component__uTjje"
        );
        chrome.runtime.sendMessage({ action: "showScrollMessage" });

        if (
          tempJobLinks.length >= numberOfJobs ||
          numberOfScrollsRequired == 0
        ) {
          chrome.runtime.sendMessage({ action: "hideScrollMessage" });
          if (type === "start") {
            let jobLinks = document.getElementsByClassName(
              "styles_jobLink__US40J"
            );
            chrome.storage.local.set({ jobLinks: jobLinks });
            startApplication(jobLinks);
          } else if (type === "resume") {
            chrome.storage.local.get("jobLinks", function (data) {
              startApplication(data.jobLinks);
            });
          }
          return;
        }
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

    // if (type === "start") {
    //   let jobLinks = document.getElementsByClassName("styles_jobLink__US40J");
    //   chrome.runtime.sendMessage(
    //     { action: "saveJobLinks", jobLinks: jobLinks },
    //     function (response) {
    //       if (response.status === "success") {
    //         startApplication(jobLinks);
    //       }
    //     }
    //   );
    // } else if (type === "resume") {
    //   chrome.runtime.sendMessage(
    //     { action: "getJobLinks" },
    //     function (response) {
    //       // console.log("Job Links: ", response.jobLinks);
    //       startApplication(response.jobLinks);
    //     }
    //   );
    // }

    scrollToBottom();

    async function startApplication(jobLinks) {
      function clickJobLinkAndApply(index) {
        chrome.storage.local.get("RecursionState", function (data) {
          // console.log(data.RecursionState);
          if (data.RecursionState) {
            return;
          }

          if (index >= jobLinks.length) {
            // All links processed, exit recursion
            chrome.runtime.sendMessage({
              action: "completedApplying",
            });
            return;
          }

          // Click on the job link
          jobLinks[index].click();
          chrome.storage.local.set({ currJobIndex: index });

          // Wait for some time to ensure the modal opens
          setTimeout(() => {
            fillTextarea(index, 0);
          }, 2000); // Adjust the time delay as needed
        });
      }

      function fillTextarea(index, time) {
        chrome.storage.local.get(["RecursionState", "jobs"], function (data) {
          if (data.RecursionState) {
            return;
          }
          const textarea = document.getElementsByClassName(
            "styles-module_component__2Y90D text-dark-aaaa text-md max-w-full placeholder-dark-a ring-inset border rounded focus:ring-dark-link bg-white  focus:ring-1 px-3 py-2 h-10 border-gray-500 disabled:text-dark-a disabled:bg-gray-200 disabled:border-dark-aa w-full styles_component__kpbt6"
          )[0];

          if (textarea) {
            let role = document.getElementsByClassName(
              "text-center font-[700]"
            )[0].innerText;
            let company =
              document.getElementsByClassName("text-lg font-[500]")[0]
                .innerText;
            let jobs = data.jobs || [];
            let jobExists = jobs.some(
              (job) => job.company === company && job.role === role
            );

            if (jobExists) {
              clickJobLinkAndApply(index + 1);
              return;
            }
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
              return;
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
            applyButton.click();

            chrome.storage.local.get("jobs", function (data) {
              let role = document.getElementsByClassName(
                "text-center font-[700]"
              )[0].innerText;
              let company =
                document.getElementsByClassName("text-lg font-[500]")[0]
                  .innerText;
              if (data.jobs) {
                let jobs = data.jobs;
                jobs.push({ company: company, role: role });
                chrome.storage.local.set({ jobs: jobs }, function () {
                  // console.log(jobs);
                });
              } else {
                chrome.storage.local.set(
                  { jobs: [{ company: company, role: role }] },
                  function () {
                    // console.log([{ company: company, role: role }]);
                  }
                );
              }
            });

            chrome.runtime.sendMessage({
              action: "updateAppliedJobsInExtensionHTML",
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

      clickJobLinkAndApply(startIndex);
    }
  }

  async function startApplying() {
    saveRecursionState(false);
    let startIndex = 0;
    let type = "start";
    let [tab] = await chrome.tabs.query({ active: true });
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: startJobApplicationProcess,
      args: [startIndex, type],
    });
  }

  async function resetApplying() {
    chrome.storage.local.clear(function () {
      console.log("Reseted!");
    });
    chrome.runtime.sendMessage(
      { action: "resetJobLinks" },
      function (response) {
        if (response.status === "success") {
          console.log("Reseted Job Links!");
        }
      }
    );
    saveRecursionState(true);
    updateJobsFound();
  }

  async function resumeApplying() {
    saveRecursionState(false);
    chrome.storage.local.get("currJobIndex", async function (data) {
      let [tab] = await chrome.tabs.query({ active: true });
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: startJobApplicationProcess,
        args: [data.currJobIndex, "resume"],
      });
    });
  }

  async function pauseApplying() {
    saveRecursionState(true);
  }

  function checkUrlAndToggleButton() {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      var activeTab = tabs[0];
      var url = new URL(activeTab.url);
      if (url.hostname.includes("wellfound.com")) {
        StartResetButton.style.display = "block";
        message.style.display = "none";
        jobsAppliedElement.style.display = "block";
        jobsFound.style.display = "block";
        loadButtonState();
        updateJobsFound();
      } else {
        StartResetButton.style.display = "none";
        message.style.display = "block";
        jobsAppliedElement.style.display = "none";
        jobsFound.style.display = "none";
      }
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
          chrome.storage.local.get("jobs", function (data) {
            if (data.jobs) {
              const jobsApplied = data.jobs.length;
              jobsAppliedElement.innerText =
                jobsApplied + "/" + results[0].result + " Applied";
            }
          });
        }
      }
    );
  }

  function saveButtonState(state) {
    chrome.storage.local.set({ buttonState: state }, function () {
      console.log("Button state saved:", state);
    });
  }

  function loadButtonState() {
    chrome.storage.local.get("buttonState", function (data) {
      if (data.buttonState) {
        if (data.buttonState === 1) {
          StartResetButton.innerText = "Start Applying";
          StartResetButton.style.backgroundColor = "green";
          ResumePauseButton.style.display = "none";
        } else if (data.buttonState === 2) {
          ResumePauseButton.innerText = "Pause";
          ResumePauseButton.style.display = "block";
          ResumePauseButton.style.backgroundColor = "yellow";
          ResumePauseButton.style.color = "black";
          StartResetButton.innerText = "Reset";
          StartResetButton.style.backgroundColor = "red";
        } else if (data.buttonState === 3) {
          ResumePauseButton.innerText = "Resume";
          ResumePauseButton.style.color = "white";
          ResumePauseButton.style.display = "block";
          ResumePauseButton.style.backgroundColor = "green";
          StartResetButton.innerText = "Reset";
          StartResetButton.style.backgroundColor = "red";
        }
      }
    });
  }

  StartResetButton.addEventListener("click", function () {
    if (StartResetButton.innerText === "Start Applying") {
      StartResetButton.innerText = "Reset";
      StartResetButton.style.backgroundColor = "red";
      ResumePauseButton.style.display = "block";
      ResumePauseButton.innerText = "Pause";
      ResumePauseButton.style.color = "black";
      ResumePauseButton.style.backgroundColor = "yellow";
      saveButtonState(2);
      startApplying();
    } else {
      StartResetButton.innerText = "Start Applying";
      StartResetButton.style.backgroundColor = "green";
      ResumePauseButton.style.display = "none";
      saveButtonState(1);
      resetApplying();
    }
  });

  ResumePauseButton.addEventListener("click", function () {
    if (ResumePauseButton.innerText === "Resume") {
      ResumePauseButton.innerText = "Pause";
      ResumePauseButton.style.color = "black";
      ResumePauseButton.style.backgroundColor = "yellow";
      saveButtonState(2);
      resumeApplying();
    } else {
      ResumePauseButton.innerText = "Resume";
      ResumePauseButton.style.color = "white";
      ResumePauseButton.style.backgroundColor = "green";
      saveButtonState(3);
      pauseApplying();
    }
  });

  checkUrlAndToggleButton();
});
