(() => {
  (function (h, o, t, j, a, r) {
    h.hj =
      h.hj ||
      function () {
        (h.hj.q = h.hj.q || []).push(arguments);
      };
    h._hjSettings = { hjid: 5145633, hjsv: 6 };
    a = o.getElementsByTagName("head")[0];
    r = o.createElement("script");
    r.async = 1;
    r.src = t + h._hjSettings.hjid + j + h._hjSettings.hjsv;
    a.appendChild(r);
  })(window, document, "https://static.hotjar.com/c/hotjar-", ".js?sv=");

  const config = {
    backgroundColor: "#fefefe",
    textColor: "#333",
    buttonColor: "#007bff",
    primaryColor: "#2578C1",
    headerTextColor: "#ffffff",
  };

  const BLUR_CONTENT = false;

  const observers = new WeakMap(); // Store observers by container element

  function loadChartJS(callback) {
    if (typeof Chart !== "undefined") {
      callback(Chart);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/chart.js";
    script.onload = function () {
      if (typeof Chart !== "undefined") {
        callback(Chart);
      } else {
        console.error("Chart is not defined even after loading Chart.js");
      }
    };
    document.head.appendChild(script);
  }

  function createWidgetHTML(userId) {
    const widget = document.createElement("div");
    widget.id = "cooler-widget";
    widget.innerHTML = `
      <div class="widget-content">
        <div id="main-tab" style="display: flex; justify-content: center; align-items: center;">
          <h3 style="margin-top: .15rem; margin-bottom: .15rem; font-weight: 600; font-size: 1rem;">${userId}</h3> <!-- Reduced font size -->
        </div>
        <div class="chart-container">
          <canvas id="myChart"></canvas>
        </div>
      </div>
      <div class="widget-footer">
        <a href="https://cooler.dev" target="_blank" rel="noopener noreferrer">
          <img id="footer-image" src="https://coolerhq.github.io/assets/cooler_logo_black.png" alt="Cooler Logo" crossOrigin="anonymous" style="max-width: 10rem; height: auto; max-height: 2rem; width: auto;" />
        </a>
      </div>
    `;
    return widget;
  }

  function createEquivalenciesHTML(userId, footprint, widgetConfig) {
    return `
      <div class="widget-content" style="background-color: #fff;">
        <div id="main-tab" style="display: flex; justify-content: center; align-items: center;">
          <h3 style="margin: 0; margin-top: .15rem; margin-bottom: .15rem; font-weight: 600; font-size: 1rem;">${userId}</h3>
        </div>
        <div class="equivalencies-container">
          <div class="equivalencies-content" style="width: fit-content; transform-origin: center;">
            <div style="height: 23px; display: flex; flex-direction: column; justify-content: center;">
              <h2 style="margin: 0; height: 23px; font-weight: 700; font-size: 1.15rem; color: ${
                widgetConfig.primaryColor
              }; width: 100%;">${footprint || 0} mt CO<sup>2</sup></h2>
            </div>
            <p style="margin-top: 0; margin-bottom: 0.25rem; padding-bottom: 0.15rem; color: #666; font-size: .9rem; border-bottom: 1px solid #ccc; width: 100%;">Your footprint</p>
            <ul id="equivalencies-list"></ul>
          </div>
        </div>
      </div>
      <div class="widget-footer">
        <a href="https://cooler.dev" target="_blank" rel="noopener noreferrer">
          <img id="footer-image" src="https://coolerhq.github.io/assets/cooler_logo_black.png" alt="Cooler Logo" style="max-width: 10rem; height: auto; max-height: 2rem; width: auto;" />
        </a>
      </div>
    `;
  }

  function calculateEquivalents(footprintTons) {
    // Constants in tons of CO2
    const CO2_PER_MILE_DRIVEN = 404 / 1000000; // 404 grams per mile
    const CO2_PER_LAPTOP_YEAR = 0.168; // tons per year
    const CO2_PER_SMARTPHONE_YEAR = 0.0088; // tons per year

    return {
      milesDriven: Math.round(footprintTons / CO2_PER_MILE_DRIVEN) || 0,
      laptopYears:
        footprintTons / CO2_PER_LAPTOP_YEAR <= 1
          ? Number((footprintTons / CO2_PER_LAPTOP_YEAR).toFixed(2))
          : Math.round(footprintTons / CO2_PER_LAPTOP_YEAR) || 0,
      smartphoneYears:
        footprintTons / CO2_PER_SMARTPHONE_YEAR <= 1
          ? Number((footprintTons / CO2_PER_SMARTPHONE_YEAR).toFixed(2))
          : Math.round(footprintTons / CO2_PER_SMARTPHONE_YEAR) || 0,
    };
  }

  function renderEquivalencies(data, widget, widgetConfig) {
    const list = widget.querySelector("#equivalencies-list");
    list.style.listStyle = "none";
    list.style.padding = "0";
    list.style.margin = "0";

    // Calculate equivalents based on footprint
    const equivalents = calculateEquivalents(data?.footprint?.amount || 0);

    const equivalenciesData = [
      {
        icon: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${widgetConfig.primaryColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-car"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>`,
        value: `${equivalents.milesDriven.toLocaleString()} miles driven`,
      },
      {
        icon: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${widgetConfig.primaryColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-laptop"><path d="M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9m16 0H4m16 0 1.28 2.55a1 1 0 0 1-.9 1.45H3.62a1 1 0 0 1-.9-1.45L4 16"/></svg>`,
        value: `${equivalents.laptopYears} years of laptop use`,
      },
      {
        icon: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${widgetConfig.primaryColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-smartphone"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/></svg>`,
        value: `${equivalents.smartphoneYears.toLocaleString()} years of smartphone charging`,
      },
    ];

    equivalenciesData.forEach((item) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <div style="display: flex; align-items: center; margin-top: 0.25rem; margin-bottom: 0.5rem;">
          <div style="background-color: ${widgetConfig.primaryColor}33; border-radius: 8px; display: flex; align-items: center; justify-content: center; width: 28px; height: 28px; min-width: 28px; min-height: 28px;">
            ${item.icon}
          </div>
          <div style="margin-left: 5px;">
            <span style="color: #333; font-size: 0.805rem;">${item.value}</span>
          </div>
        </div>
      `;
      list.appendChild(li);
    });
  }

  function applyStyles(widget, size = "md", widgetConfig) {
    const resetStyles = {
      all: "initial",
      display: "block",
      boxSizing: "border-box",
      fontFamily: "Helvetica Neue, Arial, sans-serif",
      lineHeight: "normal",
      margin: "0",
      padding: "0",
      border: "none",
      fontSize: "16px",
      color: "inherit",
    };

    Object.assign(widget.style, resetStyles);

    const sizeConfig = {
      sm: 0.8,
      md: 1.0,
      lg: 1.2,
    };

    const scale = sizeConfig[size] || 1;
    const padding = 10;

    widget.style.backgroundColor = config.backgroundColor;
    widget.style.color = config.textColor;
    widget.style.fontFamily = "Helvetica Neue, Arial, sans-serif";
    widget.style.borderRadius = "8px";
    widget.style.width = "100%";
    widget.style.height = "100%";
    widget.style.display = "flex";
    widget.style.flexDirection = "column";
    widget.style.overflow = "hidden";
    widget.style.boxShadow = "0 4px 10px rgba(0, 0, 0, 0.1)";

    // Style the content wrapper
    const content = widget.querySelector(".widget-content");
    content.style.display = "flex";
    content.style.flexDirection = "column";
    content.style.justifyContent = "space-between";
    content.style.alignItems = "center";
    content.style.height = "100%";
    content.style.width = "100%";
    content.style.boxSizing = "border-box";
    content.style.overflow = "hidden";
    content.style.backgroundColor = "#fff";

    // Style the header (main-tab)
    const mainTab = widget.querySelector("#main-tab");
    mainTab.style.textAlign = "center";
    mainTab.style.width = "100%";
    mainTab.style.backgroundColor = widgetConfig.primaryColor;
    mainTab.style.color = widgetConfig.headerTextColor;
    mainTab.style.padding = "2px 0";
    mainTab.style.borderTopLeftRadius = "8px";
    mainTab.style.borderTopRightRadius = "8px";
    mainTab.style.justifyContent = "center";
    mainTab.style.flexShrink = "0"; // Prevent header from shrinking

    // Style the content area (chart or equivalencies)
    const chartContainer = widget.querySelector(".chart-container");
    const equivalenciesContainer = widget.querySelector(
      ".equivalencies-container"
    );
    const badgeContainer = widget.querySelector(".badge-container");
    const contentArea =
      chartContainer || equivalenciesContainer || badgeContainer;

    if (contentArea) {
      contentArea.style.display = "flex";
      contentArea.style.flexDirection = "column";
      contentArea.style.alignItems = "center";
      contentArea.style.justifyContent = "center";
      contentArea.style.width = "100%";
      contentArea.style.height = "100%";
      contentArea.style.overflow = "hidden";
      contentArea.style.boxSizing = "border-box";
      contentArea.style.padding = `${padding}px`;

      contentArea.style.maxWidth = "100%";
      contentArea.style.maxHeight = "calc(100%)";

      contentArea.style.margin = "auto";
    }

    // If it's a chart, adjust the canvas size
    if (chartContainer) {
      const canvas = chartContainer.querySelector("#myChart");
      if (canvas) {
        canvas.style.width = "100%";
        canvas.style.height = "100%";
        canvas.style.maxHeight = "calc(100vh - 120px)";
        canvas.style.display = "block";
        canvas.style.boxSizing = "border-box";
      }
    }

    // Style the footer
    const footer = widget.querySelector(".widget-footer");
    footer.style.width = "100%";
    footer.style.height = "40px";
    footer.style.display = "flex";
    footer.style.alignItems = "center";
    footer.style.justifyContent = "center";
    footer.style.textAlign = "center";
    footer.style.paddingTop = "5px";
    footer.style.backgroundColor = "#000";
    footer.style.borderLeft = "2px solid #000";
    footer.style.borderRight = "2px solid #000";
    footer.style.flexShrink = "0"; // Prevent footer from shrinking

    // Apply blur effect if enabled
    if (BLUR_CONTENT) {
      if (contentArea) {
        // Create a wrapper for the content that needs to be blurred
        const blurWrapper = document.createElement("div");
        // Copy all styles from contentArea to blurWrapper
        const contentStyles = window.getComputedStyle(contentArea);
        Object.values(contentStyles).forEach((property) => {
          if (property.startsWith("--")) return;
          blurWrapper.style[property] = contentStyles[property];
        });

        // Move all content into the blur wrapper
        while (contentArea.firstChild) {
          blurWrapper.appendChild(contentArea.firstChild);
        }

        // Apply blur to wrapper
        blurWrapper.style.filter = "blur(3px)";
        blurWrapper.style.pointerEvents = "none"; // Disable interactions with content

        // Create overlay to block interactions
        const overlay = document.createElement("div");
        overlay.style.position = "absolute";
        overlay.style.top = "0";
        overlay.style.left = "0";
        overlay.style.right = "0";
        overlay.style.bottom = "0";
        overlay.style.zIndex = "999";

        // Reset and prepare contentArea as container
        contentArea.style.position = "relative";
        contentArea.style.display = "flex";
        contentArea.style.alignItems = "center";
        contentArea.style.justifyContent = "center";
        contentArea.style.height = "100%";
        contentArea.appendChild(blurWrapper);
        contentArea.appendChild(overlay);

        // Create and style upgrade button
        const upgradeButton = document.createElement("button");
        upgradeButton.textContent = "Upgrade";
        upgradeButton.style.position = "absolute";
        upgradeButton.style.left = "50%";
        upgradeButton.style.top = "50%";
        upgradeButton.style.transform = "translate(-50%, -50%)";
        upgradeButton.style.backgroundColor = widgetConfig.primaryColor;
        upgradeButton.style.color = "#ffffff";
        upgradeButton.style.border = "none";
        upgradeButton.style.padding = "10px 20px";
        upgradeButton.style.borderRadius = "5px";
        upgradeButton.style.cursor = "pointer";
        upgradeButton.style.fontSize = "15px";
        upgradeButton.style.fontWeight = "700";
        upgradeButton.style.zIndex = "1000";
        upgradeButton.style.transition = "background-color 200ms ease";

        // Add hover effect
        upgradeButton.addEventListener("mouseenter", () => {
          upgradeButton.style.backgroundColor = `${widgetConfig.primaryColor}E6`; // 90% opacity
        });

        upgradeButton.addEventListener("mouseleave", () => {
          upgradeButton.style.backgroundColor = widgetConfig.primaryColor;
        });

        upgradeButton.addEventListener("click", () => {
          window.open("https://app.cooler.dev/settings/billing", "_blank");
        });

        contentArea.appendChild(upgradeButton);
      }
    }
  }

  function renderChart(Chart, type, data, options, widget) {
    const chartContainer = widget.querySelector(".chart-container");
    const canvas = chartContainer.querySelector("#myChart");

    // Set canvas size to be fully responsive
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.display = "block";
    canvas.style.boxSizing = "border-box";

    const containerWidth = chartContainer.clientWidth;
    const containerHeight = chartContainer.clientHeight;

    canvas.width = containerWidth;
    canvas.height = containerHeight;

    const ctx = canvas.getContext("2d");
    new Chart(ctx, {
      type: type,
      data: data,
      options: {
        animation: false,
        transitions: {
          active: {
            animation: {
              duration: 0,
            },
          },
        },
        ...options,
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: 0,
        },
      },
    });
  }

  function renderMonthlyEmissionsChart(Chart, widget, data, widgetConfig) {
    // If a chart instance already exists, destroy it
    if (widget.chartInstance) {
      widget.chartInstance.destroy();
    }

    const chartData = {
      labels: data.map((item) => item.month),
      datasets: [
        {
          label: "Carbon Emissions",
          data: data.map((item) => item.value),
          backgroundColor: widgetConfig.primaryColor,
        },
      ],
    };
    const options = {
      animation: false,
      animations: false,
      responsiveAnimationDuration: 0,
      interaction: {
        mode: "index",
        intersect: false,
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "Emissions",
          },
          grid: {
            animation: {
              duration: 0,
            },
          },
        },
        x: {
          grid: {
            animation: {
              duration: 0,
            },
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
        title: {
          display: true,
          text: "Carbon Emissions by Month",
        },
      },
      transitions: {
        active: {
          animation: {
            duration: 0,
          },
        },
      },
    };
    const ctx = widget.querySelector("#myChart").getContext("2d");
    widget.chartInstance = new Chart(ctx, {
      type: "bar",
      data: chartData,
      options: {
        ...options,
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: 0,
        },
      },
    });
  }

  // function downloadWidgetAsImage(widget) {
  //   const footerImage = widget.querySelector("#footer-image");
  //   const shareButton = widget.querySelector("#save-button");

  //   const imageLoadPromise = new Promise((resolve) => {
  //     if (footerImage.complete) {
  //       resolve();
  //     } else {
  //       footerImage.onload = resolve;
  //     }
  //   });

  //   imageLoadPromise.then(() => {
  //     // shareButton.style.opacity = "0";
  //     // shareButton.style.pointerEvents = "none";

  //     html2canvas(widget, { useCORS: true, backgroundColor: null }).then(
  //       (canvas) => {
  //         const link = document.createElement("a");
  //         link.href = canvas.toDataURL("image/png");
  //         link.download = "cooler-widget.png";
  //         link.click();

  //         // shareButton.style.opacity = "1";
  //         // shareButton.style.pointerEvents = "auto";
  //       }
  //     );
  //   });
  // }

  function initWidgets(Chart, container = null) {
    const containers = container
      ? [container]
      : document.querySelectorAll(".widget-container-cooler");

    containers.forEach((container, index) => {
      const widget = container.querySelector("#cooler-widget");
      if (widget && container.getAttribute("data-initialized") === "true") {
        console.log(
          `Widget already initialized for container ${container.id}. Skipping.`
        );
        return;
      }

      const widgetId = container.getAttribute("data-widget-id");
      const size = container.getAttribute("data-size") || "lg";

      // Read custom colors from data attributes
      const primaryColor = container.getAttribute("data-primary-color");
      const headerTextColor = "#FFF";

      // Create local config for this widget
      const widgetConfig = {
        ...config,
        primaryColor: primaryColor || config.primaryColor,
        headerTextColor: headerTextColor || config.headerTextColor,
      };

      if (widgetId) {
        fetchWidgetData(widgetId, container)
          .then((widgetData) => {
            container.innerHTML = "";
            const newWidget = createWidget(
              widgetData,
              Chart,
              container,
              widgetConfig
            );
            container.appendChild(newWidget);
            applyStyles(newWidget, size, widgetConfig);

            // Mark as initialized
            container.setAttribute("data-initialized", "true");
          })
          .catch((error) => {
            console.error("Error fetching widget data:", error);
          });
      } else {
        console.warn(`Widget ID not specified for widget ${index}.`);
      }
    });
  }

  // Modify the autoInit function to ensure it only runs once
  let initialized = false;
  function autoInit() {
    if (initialized) return;
    if (
      document.readyState === "complete" ||
      document.readyState === "interactive"
    ) {
      loadChartJS(function (Chart) {
        initWidgets(Chart);
        observeDOM(Chart);
      });
      initialized = true;
    } else {
      document.addEventListener("DOMContentLoaded", function () {
        if (initialized) return;
        loadChartJS(function (Chart) {
          initWidgets(Chart);
          observeDOM(Chart);
        });
        initialized = true;
      });
    }
  }

  // Modify the createWidget function to ensure unique IDs
  let widgetCounter = 0;
  function createWidget(widgetData, Chart, container, widgetConfig) {
    const { type, data, organization } = widgetData;
    let widget;

    if (type === "badgets") {
      widget = document.createElement("div");
      widget.id = `cooler-widget-${widgetCounter++}`;
      window.currentWidgetSize = container.getAttribute("data-size") || "lg";
      widget.innerHTML = createBadgeHTML(
        organization.name,
        data.amountToNeutralizePercent
      );
      return widget;
    }

    if (type === "footprint_equivalencies") {
      widget = document.createElement("div");
      widget.id = `cooler-widget-${widgetCounter++}`;
      console.log(data);
      widget.innerHTML = createEquivalenciesHTML(
        organization.name,
        data?.footprint?.amount || 0,
        widgetConfig
      );
      renderEquivalencies(data, widget, widgetConfig);
    } else if (type === "monthly_emissions") {
      if (!Array.isArray(data) || data.length === 0) {
        widget = document.createElement("div");
        widget.id = `cooler-widget-${widgetCounter++}`;
        widget.innerHTML = createEmptyStateHTML(organization.name);
      } else {
        widget = createWidgetHTML(organization.name);
        widget.id = `cooler-widget-${widgetCounter++}`;

        // Initialize chart instance storage
        widget.chartInstance = null;

        loadChartJS(function (Chart) {
          renderMonthlyEmissionsChart(Chart, widget, data, widgetConfig);
        });
      }
    } else if (type === "amount_neutralized") {
      widget = document.createElement("div");
      widget.id = `cooler-widget-${widgetCounter++}`;
      widget.innerHTML = createNeutralizedHTML(
        organization.name,
        data.total_kg_neutralized.amount,
        data.total_kg_footprinted.amount
      );
      return widget;
    }

    return widget;
  }

  function getApiBaseUrl(container) {
    const isTesting = container.getAttribute("data-testing") === "true";
    return isTesting
      ? "https://api-staging.cooler.dev"
      : "https://api.cooler.dev";
  }

  function fetchWidgetData(widgetId, container) {
    const apiBaseUrl = getApiBaseUrl(container);
    return fetch(`${apiBaseUrl}/v1/widgets/${widgetId}`).then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    });
  }

  function observeDOM(Chart) {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1 && node.matches(".widget-container-cooler")) {
            initWidgets(Chart, node);
            if (!observers.get(node)) {
              observeWidgetChanges(Chart, node);
            }
          } else if (node.nodeType === 1) {
            const nestedContainers = node.querySelectorAll(
              ".widget-container-cooler"
            );
            nestedContainers.forEach((nested) => {
              initWidgets(Chart, nested);
              if (!observers.get(nested)) {
                observeWidgetChanges(Chart, nested);
              }
            });
          }
        });
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Set up initial observers
    document
      .querySelectorAll(".widget-container-cooler")
      .forEach((container) => {
        if (!observers.get(container)) {
          observeWidgetChanges(Chart, container);
        }
      });
  }

  function observeWidgetChanges(Chart, container) {
    // Clean up existing observer for this container only
    const existingObserver = observers.get(container);
    if (existingObserver) {
      existingObserver.disconnect();
    }

    let debounceTimeout;
    const attributeObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "attributes") {
          const container = mutation.target;
          if (container.matches(".widget-container-cooler")) {
            clearTimeout(debounceTimeout);
            debounceTimeout = setTimeout(() => {
              initWidgets(Chart, container);
            }, 300); // Adjust the delay as needed
          }
        }
      });
    });

    // Observe only this container
    attributeObserver.observe(container, {
      attributes: true,
      attributeFilter: ["data-primary-color", "data-size"],
    });
    observers.set(container, attributeObserver);

    return attributeObserver;
  }

  // Call autoInit immediately
  autoInit();

  window.MyWidget = {
    init: function () {
      loadChartJS(function (Chart) {
        initWidgets(Chart);
      });
    },
  };

  const script = document.createElement("script");
  script.src =
    "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
  script.onload = autoInit;
  document.head.appendChild(script);
})();

function createBadgeHTML(userId, percentage) {
  let badgeImage;
  if (percentage >= 100) {
    badgeImage = "https://coolerhq.github.io/assets/100.png";
  } else if (percentage >= 75) {
    badgeImage = "https://coolerhq.github.io/assets/75.png";
  } else if (percentage >= 50) {
    badgeImage = "https://coolerhq.github.io/assets/50.png";
  } else if (percentage >= 25) {
    badgeImage = "https://coolerhq.github.io/assets/25.png";
  } else if (percentage === 0) {
    return `
      <div class="widget-content" style="background-color: #fff;">
        <div id="main-tab" style="display: flex; justify-content: center; align-items: center;">
          <h3 style="margin: 0; margin-top: .15rem; margin-bottom: .15rem; font-weight: 600; font-size: 1rem;">${userId}</h3>
        </div>
        <div class="badge-container" style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 2rem; text-align: center;">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
          <p style="margin-top: 1rem; color: #666;">${userId} has not selected a neutralization goal</p>
        </div>
        <div class="widget-footer">
          <a href="https://cooler.dev" target="_blank" rel="noopener noreferrer">
            <img id="footer-image" src="https://coolerhq.github.io/assets/cooler_logo_black.png" alt="Cooler Logo" style="max-width: 6rem; height: auto; max-height: 2rem; width: auto;" />
          </a>
        </div>
      </div>
    `;
  }

  const sizeMap = {
    sm: "120px",
    md: "160px",
    lg: "200px",
  };
  // Get size from sizeConfig or default to lg
  const size = sizeMap[window.currentWidgetSize] || sizeMap.lg;

  return `
    <div class="widget-content" style="background-color: #fff;">
      <div id="main-tab" style="display: flex; justify-content: center; align-items: center;">
        <h3 style="margin: 0; margin-top: .15rem; margin-bottom: .15rem; font-weight: 600; font-size: 1rem;">${userId}</h3>
      </div>
      <div class="badge-container" style="display: flex; justify-content: center; align-items: center; height: 100%; padding: 1rem;">
        <img src="${badgeImage}" alt="Badge ${percentage}%" style="max-width: ${size}; max-height: ${size}; width: auto; height: auto;" />
      </div>
      <div class="widget-footer">
        <a href="https://cooler.dev" target="_blank" rel="noopener noreferrer">
          <img id="footer-image" src="https://coolerhq.github.io/assets/cooler_logo_black.png" alt="Cooler Logo" style="max-width: 6rem; height: auto; max-height: 2rem; width: auto;" />
        </a>
      </div>
    </div>
  `;
}

function createEmptyStateHTML(userId) {
  return `
    <div class="widget-content">
      <div id="main-tab" style="display: flex; justify-content: center; align-items: center;">
        <h3 style="margin-top: .15rem; margin-bottom: .15rem; font-weight: 600; font-size: 1rem;">${userId}</h3>
      </div>
      <div class="chart-container" style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 2rem;">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="16" x2="12" y2="12"></line>
          <line x1="12" y1="8" x2="12.01" y2="8"></line>
        </svg>
        <p style="margin-top: 1rem; color: #666; text-align: center;">${userId} has no footprint yet</p>
      </div>
      <div class="widget-footer">
        <a href="https://cooler.dev" target="_blank" rel="noopener noreferrer">
          <img id="footer-image" src="https://coolerhq.github.io/assets/cooler_logo_black.png" alt="Cooler Logo" crossOrigin="anonymous" style="max-width: 10rem; height: auto; max-height: 2rem; width: auto;" />
        </a>
      </div>
    </div>
  `;
}

function createNeutralizedHTML(userId, neutralized, footprint) {
  return `
    <div class="widget-content" style="background-color: #fff; display: flex; flex-direction: column; height: 100%;">
      <div id="main-tab" style="display: flex; justify-content: center; align-items: center;">
        <h3 style="margin: 0; margin-top: .15rem; margin-bottom: .15rem; font-weight: 600; font-size: 1rem;">${userId}</h3>
      </div>
      <div class="neutralized-container" style="flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: space-between; text-align: center; color: #2578C2; padding: 1rem 0;">
        <div style="display: flex; flex-direction: column; justify-content: center; height: 100%;">
          <div style="display: flex; align-items: center;">
            <span style="font-size: 4.5rem; font-weight: 700; line-height: 1">${neutralized}</span>
            <span style="font-size: 1.4rem; font-weight: 700; margin-top: auto; margin-bottom: 0.25rem;">mt CO<sup>2</sup></span>
          </div>
          <span style="font-size: 1rem; color: #666;">Emissions Neutralized</span>
        </div>
        <img src="https://coolerhq.github.io/assets/cooler_certified.png" alt="Cooler Certified" style="width: 160px; height: auto;" />
      </div>
    </div>
  `;
}
