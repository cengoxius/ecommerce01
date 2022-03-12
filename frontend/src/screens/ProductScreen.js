import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Row,
  Col,
  Image,
  ListGroup,
  Button,
  Card,
  FormControl,
  Form,
} from "react-bootstrap";
import { listProductDetails } from "../redux/actions/productActions";
import Loading from "../components/Loading";
import Message from "../components/Message";
import products from "../products";
import Rating from "../components/Rating";
import { addToCart } from "../redux/actions/cartActions";
import { createProductReview } from "../redux/actions/productActions";

const ProductScreen = () => {
  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  let navigate = useNavigate();
  const dispatch = useDispatch();
  let params = useParams();

  const productDetails = useSelector((state) => state.productDetails);
  const { product, loading, error } = productDetails;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const productReviewCreate = useSelector((state) => state.productReviewCreate);
  const {
    loading: loadingProductReview,
    success: successProductReview,
    error: errorProductReview,
  } = productReviewCreate;

  useEffect(() => {
    if (successProductReview) {
      setRating(0);
      setComment("");
    }
    if (error) {
      navigate("/");
    }
    dispatch(listProductDetails(params.id));
  }, [dispatch, params.id, successProductReview]);

  const addToCartHandler = () => {
    dispatch(addToCart(params.id, qty));
    navigate(`/cart`);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(createProductReview(params.id, { rating, comment }));
  };

  return (
    <>
      {loading ? (
        <Loading />
      ) : error ? (
        <Message variant="danger"></Message>
      ) : (
        product && (
          <>
            <Link className="btn btn-light my-3" to="/">
              Geri / Go back
            </Link>
            <Row>
              <Col md={4}>
                <Image src={product.image} alt={product.name} fluid />
              </Col>
              <Col md={5}>
                <h3>{product.name}</h3>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <Rating
                      value={product.rating}
                      text={`${product.rating} Yorum/Reviews`}
                    />
                  </ListGroup.Item>
                  <ListGroup.Item>Fiyat/Price: ${product.price}</ListGroup.Item>
                  <ListGroup.Item>
                    Ürün Bilgileri/Description: {product.description}
                  </ListGroup.Item>
                </ListGroup>
              </Col>
              <Col md={3}>
                <Card>
                  <ListGroup variant="flush">
                    <ListGroup.Item>
                      <Row>
                        <Col>Fiyat/Price:</Col>
                        <Col>
                          <strong>${product.price}</strong>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <Row>
                        <Col>Durum/Status:</Col>
                        <Col>
                          {product.countInStock > 0
                            ? `Stokta var/In stock`
                            : `Stokta YOK :(/Out of stock`}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                    {product.countInStock > 0 && (
                      <ListGroup.Item>
                        <Row>
                          <Col>Adet/Qty</Col>
                          <Col>
                            <FormControl
                              as="select"
                              value={qty}
                              onChange={(e) => setQty(e.target.value)}
                            >
                              {[...Array(product.countInStock).keys()].map(
                                (x) => (
                                  <option value={x + 1} key={x + 1}>
                                    {x + 1}
                                  </option>
                                )
                              )}
                            </FormControl>
                          </Col>
                        </Row>
                      </ListGroup.Item>
                    )}
                    <ListGroup.Item>
                      <Button
                        onClick={addToCartHandler}
                        className="btn btn-primary d-block w-100"
                        type="button"
                        disabled={product.countInStock === 0}
                      >
                        Sepete Ekle/Add to cart
                      </Button>
                    </ListGroup.Item>
                  </ListGroup>
                </Card>
              </Col>
            </Row>
            <Row className="mt-4">
              <Col md={6}>
                <h2>Yorumlar/Reviews</h2>
                {loadingProductReview && <Loading />}
                {product.reviews.length === 0 && (
                  <Message variant="info">Yorum yok/No Reviews</Message>
                )}
                <ListGroup variant="flush">
                  {product.reviews.map((review) => (
                    <ListGroup.Item key={review._id}>
                      <strong>{review.name}</strong>
                      <Rating value={review.rating} text="Reviews" />
                      <p>{review.createdAt.substring(0, 10)}</p>
                      <p>{review.comment}</p>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
                <h3>Yeni yorum yaz / Write a customer review</h3>
                {userInfo ? (
                  <Form onSubmit={submitHandler}>
                    {errorProductReview && (
                      <Message variant="danger">{errorProductReview}</Message>
                    )}

                    <Form.Group controlId="rating">
                      <Form.Label>Puan/Rating</Form.Label>
                      <Form.Control
                        as="select"
                        value={rating}
                        onChange={(e) => setRating(e.target.value)}
                      >
                        <option value="">Select ...</option>
                        <option value="1">1 - Kötü/Poor</option>
                        <option value="2">2 - Orta/Fair</option>
                        <option value="3">3 - İyi/Good</option>
                        <option value="4">4 - Çok iyi/Very good</option>
                        <option value="5">5 - Mükemmel/Perfect</option>
                      </Form.Control>
                    </Form.Group>
                    <Form.Group className="mt-3" controlId="comment">
                      <Form.Label>Yorum/Comment</Form.Label>
                      <Form.Control
                        as="textarea"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Comment"
                      ></Form.Control>
                    </Form.Group>
                    <Button type="submit" className="mt-3" vatiant="primary">
                      Kaydet/Submit
                    </Button>
                  </Form>
                ) : (
                  <Message variant="info">
                    Yorum yazmak için <Link to="/login">Giriş yapın/Sign in</Link> to write a review
                  </Message>
                )}
              </Col>
            </Row>
          </>
        )
      )}
    </>
  );
};

export default ProductScreen;
