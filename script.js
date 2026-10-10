
document.addEventListener("DOMContentLoaded", async () => {
    const menuItems = document.querySelectorAll(".menu-item");

    const overlay = document.getElementById("food-details-overlay");
    const content = document.getElementById("food-details-content");
    const foodImage = document.getElementById("food-image");
    const foodName = document.getElementById("food-name");
    const foodIngredients = document.getElementById("food-ingredients");
    const closeButton = document.querySelector(".close-button");

    // Cargar precios desde Supabase
    async function cargarPrecios() {
        try {
          if (!window.supabase || !window.RANCHO_SUPABASE_CONFIG) {
    console.error("Falta configurar Supabase.");
    return;
}

const db = window.supabase.createClient(
    window.RANCHO_SUPABASE_CONFIG.url,
    window.RANCHO_SUPABASE_CONFIG.anonKey
);

            const { data, error } = await db
                .from("products")
                .select("id, price")
                .eq("active", true);

            if (error) throw error;

            data.forEach(producto => {
                const item = document.querySelector(
                    `.menu-item[data-product-id="${producto.id}"]`
                );

                if (!item) {
                    console.warn("No se encontró en el menú el producto:", producto.id);
                    return;
                }

                const priceElement = item.querySelector("span");

                if (priceElement) {
                    priceElement.textContent = "$" +
                        Number(producto.price).toLocaleString("es-CO");
                }
            });
        } catch (error) {
            console.error("Error cargando precios:", error);
        }
    }

    await cargarPrecios();

    // Abrir detalles de la comida
    menuItems.forEach(item => {
        item.addEventListener("click", () => {
            if (!overlay || !foodName || !foodIngredients) return;

            const nameElement = item.querySelector("p:first-child");
            const descriptionElement = item.querySelector(".description");
            const priceElement = item.querySelector("span");

            const name = nameElement
                ? nameElement.textContent.trim()
                : "Producto";

            const description = descriptionElement
                ? descriptionElement.textContent.trim()
                : "Producto de Rancho Burger";

            const price = priceElement
                ? priceElement.textContent.trim()
                : "";

            foodName.textContent = name;

            if (price) {
                foodIngredients.innerHTML = `
                    <strong></strong>
                    <br><br>
                    <span class="modal-price"></span>
                `;
                foodIngredients.querySelector("strong").textContent = description;
                foodIngredients.querySelector(".modal-price").textContent = price;
            } else {
                foodIngredients.textContent = description;
            }

            const section = item.closest(".menu-section");
            const sectionImage = section
                ? section.querySelector(".section-image")
                : null;

            if (foodImage) {
                if (sectionImage) {
                    foodImage.src = sectionImage.src;
                    foodImage.alt = name;
                    foodImage.style.display = "block";
                } else {
                    foodImage.style.display = "none";
                }
            }

            overlay.classList.add("active");
            document.body.style.overflow = "hidden";
        });
    });

    // Cerrar ventana de detalles
    function closeModal() {
        if (overlay) overlay.classList.remove("active");
        document.body.style.overflow = "";
    }

    if (closeButton) {
        closeButton.addEventListener("click", closeModal);
    }

    if (overlay) {
        overlay.addEventListener("click", event => {
            if (event.target === overlay) closeModal();
        });
    }

    document.addEventListener("keydown", event => {
        if (event.key === "Escape") closeModal();
    });

    if (content) {
        content.addEventListener("click", event => {
            event.stopPropagation();
        });
    }
});
