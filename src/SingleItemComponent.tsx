import React, {useEffect, useState} from 'react';
import {Button, Col, Container, Form, InputGroup, Row} from "react-bootstrap";
import {ShopItem} from "./ShopItem";
import "./SingleItemComponent.scss";
import {DataServiceInstance} from "./DataService";
import {useParams} from "react-router-dom";
import {cartService} from "./CartService";
import {cartItemFromShopItem} from "./CartItem";
import {CheckboxDescription, Description, ImageDescription, TextDescription} from "./Descriptions";

// Состояние компоненты "Страница товара"
interface SingleItemComponentState {
    item: ShopItem | null;
}

/**
 * Страница товара
 */
export function SingleItemComponent() {
    // itemId из URL-адреса. Пример /item/1, itemId == 1
    let {itemId} = useParams();

    let [state, changeState] = useState<SingleItemComponentState>({item: null});

    useEffect(() => {
        // Один раз загружаем информацию о товаре
        if (itemId) {
            DataServiceInstance.getItem(+itemId).then(value => {
                changeState({
                    item: value
                });
            });
        }
    }, []);

    let item = state.item;

    /**
     * Функция обработки добавления в корзину
     */
    function addToCart() {
        if (item != null) {
            cartService.addCartItem(cartItemFromShopItem(item));
        }
    }

    function renderText(desc: TextDescription) {
        return (
          <p>{desc.text}</p>
        );
    }

    function renderImage(desc: ImageDescription) {
        return (
          <img className="description-image" src={desc.imageSrc}/>
        );
    }

    function renderCheckbox(desc: CheckboxDescription) {
        return (
            <div>
                <Form>
                    {
                        desc.variant.map(checkBox => {
                            return (
                                <Form.Check name={desc.name} type={"checkbox"} label={checkBox}/>
                            )
                        })
                    }
                </Form>
            </div>
        );
    }

    function renderDescriptions(descriptions: Description[]) {
        return descriptions.map((description: Description) => {
            if (description.type === "text") {
                return renderText(description as TextDescription);
            } else if (description.type === "image") {
                return renderImage(description as ImageDescription);
            } else if (description.type === "checkbox") {
                return renderCheckbox(description as CheckboxDescription);
            }
        });
    }

    /**
     * Отрисовка элемента
     * @param item
     */
    function renderItem(item: ShopItem | null) {
        if (!item) {
            return (<div></div>);
        }

        return (
            <Container>
                <Row>
                    <Col>
                        <img className={"item-image"} src={item.imageSrc}/>
                    </Col>
                    <Col>
                        <h1>{item.title}</h1>
                        <p> {item.brief}</p>
                        <h5>Описание</h5>
                        {renderDescriptions(item.description)}
                        <span><b>₽{item.price}</b></span> <Button onClick={() => addToCart()} variant={"success"}>Добавить в корзину</Button>
                    </Col>
                </Row>
            </Container>
        );
    }

    return renderItem(item);
}
