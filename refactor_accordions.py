import re

# Read the file
with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Define the pattern for the onclick attribute
# The pattern matches the specific onclick content we found
onclick_pattern = r' onclick="this\.classList\.toggle\(\'expanded\'\); this\.setAttribute\(\'aria-expanded\', this\.classList\.contains\(\'expanded\'\)\); this\.nextElementSibling\.classList\.toggle\(\'expanded\'\);"'

# Remove the onclick attribute
new_content = re.sub(onclick_pattern, '', content)

# Check if replacements were made
if new_content == content:
    print("No onclick attributes found to replace!")
else:
    print("Onclick attributes removed.")

# Prepare the new JS logic
new_js = """
        // Initialize Accordions (Added by Palette for accessibility)
        document.querySelectorAll('.code-accordion-header').forEach((header, index) => {
            const content = header.nextElementSibling;
            if (content && content.classList.contains('code-accordion-content')) {
                // Generate unique ID for accessibility
                const contentId = `accordion-content-${index}`;
                content.id = contentId;
                header.setAttribute('aria-controls', contentId);

                header.addEventListener('click', () => {
                    const isExpanded = header.getAttribute('aria-expanded') === 'true';
                    header.setAttribute('aria-expanded', !isExpanded);
                    header.classList.toggle('expanded');
                    content.classList.toggle('expanded');
                });
            }
        });
"""

# Append the new JS logic before the closing </script> tag of the LAST script block that contains custom logic
# We look for the script block that ends with "Initialize copy buttons" logic
# The file has a long script block at the end.
# We can search for the "Initialize copy buttons" block and append after it.

copy_btn_logic = """            btn.addEventListener('click', async (e) => {
                e.stopPropagation();
                const code = block.querySelector('code')?.innerText || '';
                if (!code) return;

                try {
                    await navigator.clipboard.writeText(code);
                    btn.textContent = 'Copied!';
                    btn.classList.add('copied');
                    btn.ariaLabel = 'Copied successfully';
                    setTimeout(() => {
                        btn.textContent = 'Copy';
                        btn.classList.remove('copied');
                        btn.ariaLabel = 'Copy code to clipboard';
                    }, 2000);
                } catch (err) {
                    btn.textContent = 'Error';
                    setTimeout(() => { btn.textContent = 'Copy'; }, 2000);
                }
            });
        });"""

if copy_btn_logic in new_content:
    print("Found copy button logic, appending accordion logic after it.")
    replacement = copy_btn_logic + "\n" + new_js
    new_content = new_content.replace(copy_btn_logic, replacement)
else:
    print("Could not find copy button logic to append to. Appending to end of last script.")
    # Fallback: Find the last </script> and insert before it
    last_script_idx = new_content.rfind('</script>')
    if last_script_idx != -1:
        new_content = new_content[:last_script_idx] + new_js + new_content[last_script_idx:]

# Write the file back
with open('index.html', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("index.html updated successfully.")
