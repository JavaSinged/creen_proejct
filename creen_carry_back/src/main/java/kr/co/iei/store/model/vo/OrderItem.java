package kr.co.iei.store.model.vo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class OrderItem {
	private Integer menuId;
	private Integer quantity;
	private Integer price;
	private String options;
}
