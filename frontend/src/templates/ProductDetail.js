import React, { useState, useEffect } from "react"
import { useQuery } from "@apollo/client"
import Grid from "@material-ui/core/Grid"
import useMediaQuery from "@material-ui/core/useMediaQuery"

import Layout from "../components/ui/layout"
//import SEO from "../components/ui/seo"
import ProductImages from "../components/product-detail/ProductImages"
import ProductInfo from "../components/product-detail/ProductInfo"
import RecentlyViewed from "../components/product-detail/RecentlyViewed"
//import ProductReviews from "../components/product-detail/ProductReviews"

import { GET_DETAILS } from "../apollo/queries"

export default function ProductDetail({
	pageContext: { name, id, category, description, variants, product },
}) {
	const [selectedVariant, setSelectedVariant] = useState(0)
	const [selectedImage, setSelectedImage] = useState(0) //TODO: lecture 178 @8:36
	const [stock, setStock] = useState(null)
	// const [rating, setRating] = useState(0)
	// const [edit, setEdit] = useState(false)

	const matchesMD = useMediaQuery(theme => theme.breakpoints.down("md"))

	// ######################## Recently Viewed products handling:
	const params =
		// get the part after "?" in current URL in the address bar
		typeof window !== "undefined"
			? new URLSearchParams(window.location.search)
			: { get: () => null }
	const style = params.get("style") // params.get("style"): ?style=Male ==> get "Male"

	const recentlyViewedProducts =
		typeof window !== "undefined"
			? JSON.parse(window.localStorage.getItem("recentlyViewed"))
			: null

	useEffect(() => {
		const styledVariant = variants.filter(
			variant => variant.style === style
		)[0]

		const variantIndex = variants.indexOf(styledVariant)

		let recentlyViewed = JSON.parse(
			window.localStorage.getItem("recentlyViewed")
		)

		if (recentlyViewed) {
			if (recentlyViewed.length === 10) {
				recentlyViewed.shift() // remove the first element of the array, in this case, the oldest recentlyViewed product
			}

			if (
				// check this so that in case we refresh the page, we'll not add that same product into recentlyViewed
				!recentlyViewed.some(
					product =>
						product.name === name &&
						// Male & Female product would have the same name, so we have to check
						// their index to make sure it's the right variant
						product.selectedVariant === variantIndex
				)
			) {
				recentlyViewed.push({
					...product,
					selectedVariant: variantIndex,
				})
			}
		} else {
			recentlyViewed = [{ ...product, selectedVariant: variantIndex }]
		}

		window.localStorage.setItem(
			"recentlyViewed",
			JSON.stringify(recentlyViewed)
		)

		setSelectedVariant(variantIndex)
	}, [style])

	// ######################## Run-time queries handling:
	const { error, data } = useQuery(GET_DETAILS, {
		variables: { id }, // {id} destructured from component's prop
	})

	useEffect(() => {
		if (error) {
			setStock(-1)
		} else if (data) {
			setStock(data.product.variants)
			//setRating(data.product.rating)
		}
	}, [error, data])

	return (
		<Layout>
			<Grid container direction="column">
				<Grid item container direction={matchesMD ? "column" : "row"}>
					<ProductImages
						images={variants[selectedVariant].images}
						selectedImage={selectedImage}
						setSelectedImage={setSelectedImage}
					/>
					<ProductInfo
						name={name}
						description={description}
						variants={variants}
						selectedVariant={selectedVariant}
						setSelectedVariant={setSelectedVariant}
						stock={stock}
					/>
				</Grid>
				<RecentlyViewed products={recentlyViewedProducts} />
			</Grid>
		</Layout>
	)
}

// export default function ProductDetail({
// 	pageContext: { name, id, category, description, variants, product },
// }) {
// 	const [selectedVariant, setSelectedVariant] = useState(0)
// 	const [selectedImage, setSelectedImage] = useState(0)
// 	const [stock, setStock] = useState(null)
// 	const [rating, setRating] = useState(0)
// 	const [edit, setEdit] = useState(false)

// 	const matchesMD = useMediaQuery(theme => theme.breakpoints.down("md"))

// 	const params =
// 		typeof window !== "undefined"
// 			? new URLSearchParams(window.location.search)
// 			: { get: () => null }
// 	const style = params.get("style")

// 	const recentlyViewedProducts =
// 		typeof window !== "undefined"
// 			? JSON.parse(window.localStorage.getItem("recentlyViewed"))
// 			: null

// 	const { loading, error, data } = useQuery(GET_DETAILS, {
// 		variables: { id },
// 	})

// 	useEffect(() => {
// 		if (error) {
// 			setStock(-1)
// 		} else if (data) {
// 			setStock(data.product.variants)
// 			setRating(data.product.rating)
// 		}
// 	}, [error, data])

// 	useEffect(() => {
// 		const styledVariant = variants.filter(
// 			variant => variant.style === params.get("style")
// 		)[0]

// 		const variantIndex = variants.indexOf(styledVariant)

// 		var recentlyViewed = JSON.parse(
// 			window.localStorage.getItem("recentlyViewed")
// 		)

// 		if (recentlyViewed) {
// 			if (recentlyViewed.length === 10) {
// 				recentlyViewed.shift()
// 			}

// 			if (
// 				!recentlyViewed.some(
// 					product =>
// 						product.node.name === name &&
// 						product.selectedVariant === variantIndex
// 				)
// 			) {
// 				recentlyViewed.push({
// 					...product,
// 					selectedVariant: variantIndex,
// 				})
// 			}
// 		} else {
// 			recentlyViewed = [{ ...product, selectedVariant: variantIndex }]
// 		}

// 		window.localStorage.setItem(
// 			"recentlyViewed",
// 			JSON.stringify(recentlyViewed)
// 		)

// 		setSelectedVariant(variantIndex)
// 	}, [style])

// 	return (
// 		<Layout>
// 			<SEO title={name.split(" ")[0]} description={description} />
// 			<Grid container direction="column">
// 				<Grid item container direction={matchesMD ? "column" : "row"}>
// 					<ProductImages
// 						images={variants[selectedVariant].images}
// 						selectedImage={selectedImage}
// 						setSelectedImage={setSelectedImage}
// 					/>
// 					<ProductInfo
// 						name={name}
// 						description={description}
// 						variants={variants}
// 						selectedVariant={selectedVariant}
// 						setSelectedVariant={setSelectedVariant}
// 						stock={stock}
// 						rating={rating}
// 						setEdit={setEdit}
// 						product={id}
// 					/>
// 				</Grid>
// 				<RecentlyViewed products={recentlyViewedProducts} />
// 				<ProductReviews product={id} edit={edit} setEdit={setEdit} />
// 			</Grid>
// 		</Layout>
// 	)
// }
