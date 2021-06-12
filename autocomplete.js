const autoComplete = ({
  autocomplete,
  renderOption,
  onOptionSelect,
  inputVal,
  getData,
}) => {
  autocomplete.innerHTML = ` 
            <label><b>Select a movie</b></label>
            <input type="text">
            <div class="dropdown">
            <div class="dropdown-menu">
            <div class="dropdown-content results">
            </div>
            </div>
`;
  const input = autocomplete.querySelector("input");
  const results = autocomplete.querySelector("div.results");
  const dropMenu = autocomplete.querySelector("div.dropdown");

  const onInputFunc = async (e) => {
    const items = await getData(e.target.value);
    if (!items.length) {
      dropMenu.remove("is-active");
      return;
    }
    results.textContent = "";
    dropMenu.classList.add("is-active");

    for (let item of items) {
      const option = document.createElement("a");
      option.classList.add("dropdown-item");

      option.innerHTML = renderOption(item);

      option.addEventListener("click", function () {
        dropMenu.classList.remove("is-active");
        input.value = inputVal(item);
        onOptionSelect(item);
      });
      results.appendChild(option);
    }
  };
  input.addEventListener("input", debounce(onInputFunc));
  document.addEventListener("click", (e) => {
    if (!autocomplete.contains(e.target)) {
      dropMenu.classList.remove("is-active");
    }
  });
};
