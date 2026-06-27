from pathlib import Path
import fitz


def extract_text_from_file(file_path: str | Path) -> str:

    path = Path(file_path)

    text = ""


    if path.suffix.lower() == ".pdf":

        doc = fitz.open(path)

        for page in doc:

            text += page.get_text()


        doc.close()


    return text





def clean_extracted_text(text: str) -> str:


    replacements = {

        "\ufffd": "",

        "â€¢": "-",

        "â€“": "-",

        "â€”": "-",

        "\x00": "",

    }



    for old,new in replacements.items():

        text = text.replace(old,new)



    return text.strip()
