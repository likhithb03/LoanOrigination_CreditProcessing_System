class LocalDataGrid {
    constructor(config) {
        this.tableBody = document.getElementById(config.tableBodyId);
        this.dataset = config.dataset || [];
        this.columns = config.columns || [];
        this.searchInput = document.getElementById(config.searchInputId);
        this.filterInputs = config.filterInputs || []; // Array of { id: string, key: string }
        this.itemsPerPage = config.itemsPerPage || 5;
        this.currentPage = 1;
        this.sortKey = config.initialSortKey || "";
        this.sortOrder = config.initialSortOrder || "asc"; // "asc" or "desc"
        this.actionsRenderer = config.actionsRenderer || null;
        
        // Pagination Elements
        this.rangeStartEl = document.getElementById("gridRangeStart");
        this.rangeEndEl = document.getElementById("gridRangeEnd");
        this.totalItemsEl = document.getElementById("gridTotalItems");
        this.paginationLinksEl = document.getElementById("gridPaginationLinks");
        
        this.init();
    }

    init() {
        // Setup search listener
        if (this.searchInput) {
            this.searchInput.addEventListener("input", () => {
                this.currentPage = 1;
                this.render();
            });
        }

        // Setup filter listeners
        this.filterInputs.forEach(f => {
            const el = document.getElementById(f.id);
            if (el) {
                el.addEventListener("change", () => {
                    this.currentPage = 1;
                    this.render();
                });
            }
        });

        // Setup column sorting headers
        this.setupSortingHeaders();

        // Initial Render
        this.render();
    }

    setupSortingHeaders() {
        const table = this.tableBody.closest("table");
        if (!table) return;

        const headers = table.querySelectorAll("thead th[data-sort]");
        headers.forEach(th => {
            th.style.cursor = "pointer";
            th.classList.add("position-relative");
            
            // Add sort indicator icon
            const icon = document.createElement("i");
            icon.className = "fa-solid fa-sort text-muted ms-2 opacity-50";
            th.appendChild(icon);

            th.addEventListener("click", () => {
                const key = th.getAttribute("data-sort");
                if (this.sortKey === key) {
                    this.sortOrder = this.sortOrder === "asc" ? "desc" : "asc";
                } else {
                    this.sortKey = key;
                    this.sortOrder = "asc";
                }

                // Update headers styling
                headers.forEach(h => {
                    const hIcon = h.querySelector("i");
                    if (h === th) {
                        hIcon.className = this.sortOrder === "asc" 
                            ? "fa-solid fa-sort-up text-primary ms-2" 
                            : "fa-solid fa-sort-down text-primary ms-2";
                    } else {
                        hIcon.className = "fa-solid fa-sort text-muted ms-2 opacity-50";
                    }
                });

                this.render();
            });
        });
    }

    getFilteredData() {
        let data = [...this.dataset];

        // 1. Search Query Filter
        if (this.searchInput && this.searchInput.value.trim() !== "") {
            const query = this.searchInput.value.toLowerCase().trim();
            data = data.filter(row => {
                return Object.values(row).some(val => 
                    val !== null && val !== undefined && val.toString().toLowerCase().includes(query)
                );
            });
        }

        // 2. Dropdown Filter
        this.filterInputs.forEach(f => {
            const el = document.getElementById(f.id);
            if (el && el.value !== "" && el.value !== "all") {
                const filterVal = el.value.toLowerCase();
                data = data.filter(row => {
                    const rowVal = row[f.key];
                    return rowVal !== null && rowVal !== undefined && rowVal.toString().toLowerCase() === filterVal;
                });
            }
        });

        // 3. Sorting
        if (this.sortKey) {
            data.sort((a, b) => {
                let valA = a[this.sortKey];
                let valB = b[this.sortKey];

                // Handle numeric conversions if needed
                if (!isNaN(Number(valA)) && !isNaN(Number(valB))) {
                    valA = Number(valA);
                    valB = Number(valB);
                } else {
                    valA = valA ? valA.toString().toLowerCase() : "";
                    valB = valB ? valB.toString().toLowerCase() : "";
                }

                if (valA < valB) return this.sortOrder === "asc" ? -1 : 1;
                if (valA > valB) return this.sortOrder === "asc" ? 1 : -1;
                return 0;
            });
        }

        return data;
    }

    render() {
        if (!this.tableBody) return;

        const filtered = this.getFilteredData();
        const total = filtered.length;

        // Pagination bounds
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = Math.min(startIndex + this.itemsPerPage, total);
        const paginated = filtered.slice(startIndex, endIndex);

        // Render Table Body
        this.tableBody.innerHTML = "";
        
        if (total === 0) {
            // Render empty state
            const colCount = this.columns.length + (this.actionsRenderer ? 1 : 0);
            this.tableBody.innerHTML = `
                <tr>
                    <td colspan="${colCount}" class="p-0">
                        <div class="text-center py-5">
                            <i class="fa-regular fa-folder-open fa-3x text-muted opacity-50 mb-3"></i>
                            <h6 class="fw-bold text-muted">No Matching Records</h6>
                            <p class="text-muted small">Try modifying search or filter criteria.</p>
                        </div>
                    </td>
                </tr>
            `;
            this.updatePaginationUI(0, 0, 0);
            return;
        }

        paginated.forEach(row => {
            const tr = document.createElement("tr");
            
            this.columns.forEach(col => {
                const td = document.createElement("td");
                
                if (col.renderer) {
                    td.innerHTML = col.renderer(row[col.key], row);
                } else {
                    td.textContent = row[col.key] !== null ? row[col.key] : "";
                }
                
                tr.appendChild(td);
            });

            // Actions column
            if (this.actionsRenderer) {
                const actionsTd = document.createElement("td");
                actionsTd.innerHTML = this.actionsRenderer(row);
                tr.appendChild(actionsTd);
            }

            this.tableBody.appendChild(tr);
        });

        this.updatePaginationUI(startIndex + 1, endIndex, total);
    }

    updatePaginationUI(start, end, total) {
        if (this.rangeStartEl) this.rangeStartEl.textContent = start;
        if (this.rangeEndEl) this.rangeEndEl.textContent = end;
        if (this.totalItemsEl) this.totalItemsEl.textContent = total;

        if (!this.paginationLinksEl) return;
        this.paginationLinksEl.innerHTML = "";

        const totalPages = Math.ceil(total / this.itemsPerPage);
        if (totalPages <= 1) {
            this.paginationLinksEl.innerHTML = `
                <li class="page-item disabled"><a class="page-link" href="#">&laquo;</a></li>
                <li class="page-item active"><a class="page-link" href="#">1</a></li>
                <li class="page-item disabled"><a class="page-link" href="#">&raquo;</a></li>
            `;
            return;
        }

        // Previous button
        let innerHtml = `
            <li class="page-item ${this.currentPage === 1 ? 'disabled' : ''}">
                <a class="page-link" href="#" data-page="${this.currentPage - 1}">&laquo;</a>
            </li>
        `;

        // Page buttons
        for (let i = 1; i <= totalPages; i++) {
            innerHtml += `
                <li class="page-item ${this.currentPage === i ? 'active' : ''}">
                    <a class="page-link" href="#" data-page="${i}">${i}</a>
                </li>
            `;
        }

        // Next button
        innerHtml += `
            <li class="page-item ${this.currentPage === totalPages ? 'disabled' : ''}">
                <a class="page-link" href="#" data-page="${this.currentPage + 1}">&raquo;</a>
            </li>
        `;

        this.paginationLinksEl.innerHTML = innerHtml;

        // Click handlers
        this.paginationLinksEl.querySelectorAll("a[data-page]").forEach(link => {
            link.addEventListener("click", (e) => {
                e.preventDefault();
                this.currentPage = parseInt(link.getAttribute("data-page"));
                this.render();
            });
        });
    }
}
