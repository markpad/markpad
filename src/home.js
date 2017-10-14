const Home = (path = "") => {

    let homeTemplate = `<ul>
        <li><a href="https://www.github.com/markpad/markpad.github.io/wiki/about" target="_blank">About</a></li>
        <li><a href="https://www.github.com/markpad/markpad" target="_blank">GitHub</a></li>
    </ul>
    <main>
        <h1>Markpad</h1>
        <h2>Collaborative Ready To Use Markdown Editor</h2>
        <form onsubmit="goToMarkpad()">
            <label for="path">markpad.github.io/</label>
            <input type="text" name="path" id="path">
            <button type="submit">Go!</button>
        </form>
    </main>`;

    let simplemdeTemplate = `<textarea data-selector="simplemde-textarea" title="SimpleMDE textarea"></textarea>`;

    const init = () =>{
        let templateToRender = path === "" || path === "index.html" ? homeTemplate : simplemdeTemplate;
        console.log(templateToRender);
        document.body.innerHTML = templateToRender;
    };

    return {
        init
    };
}
export default Home;