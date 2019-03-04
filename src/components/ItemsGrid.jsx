import React from 'react';
import styled from 'styled-components';

const ItemsStyles = styled.div`
  --responsive-width: 150px;
  @media (min-width: 700px) {
    --responsive-width: 175px;
  }
  @media (min-width: 1000px) {
    --responsive-width: 225px;
  }
  margin: 64px auto 0 auto;
  padding: 24px;
  display: grid;
  grid-column-gap: 20px;
  grid-row-gap: 40px;
  grid-template-columns: repeat(auto-fit, minmax(var(--responsive-width), 1fr));
  justify-items: center;
  .item {
    width: var(--responsive-width);
    height: calc(var(--responsive-width) + 80px);
    transition: all 0.4s cubic-bezier(0.19, 1, 0.22, 1);
    transform: scale(0.98);
    cursor: pointer;
    &:hover {
      transform: scale(1) translate(0, -2px);
    }
    img {
      box-shadow: 0px 3px 11px 5px rgba(0, 0, 0, 0.2);
      width: 100%;
      max-height: var(--responsive-width);
      object-fit: cover;
      border-top-left-radius: 4px;
      border-top-right-radius: 4px;
      margin-bottom: -5px;
    }
    .title {
      padding: 8px;
      font-family: system-ui;
      border-bottom-left-radius: 4px;
      border-bottom-right-radius: 4px;
      max-height: 80px;
      background: white;
      line-height: 1.5em;
      box-sizing: content-box;
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      text-overflow: ellipsis;
    }
  }
`;

export default ({ items }) => (
  <ItemsStyles className="ItemsStyles">
    {items.map(item => (
      <a href={item.url}>
        <div className="item" key={item.title}>
          <img src={item.image} alt={item.title} />
          <div className="title">{item.title}</div>
        </div>
      </a>
    ))}
  </ItemsStyles>
);