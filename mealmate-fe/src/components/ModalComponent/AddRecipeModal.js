import React, { useState } from "react";
import { Modal, Form, Input, Button, message, Space } from "antd";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
import { api, endpoints } from "../../utils/axiosInstance";
import { useMealMate } from "../../context/MealMateContext";

const { TextArea } = Input;

const AddRecipeModal = ({ visible, onCancel, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { user } = useMealMate();

  const handleSubmit = async (values) => {
    try {
      setLoading(true);

      // Kiểm tra quyền admin
      if (!user || user.role !== "ADMIN") {
        message.error("Bạn không có quyền thực hiện thao tác này!");
        return;
      }

      // Validate và chuyển đổi dữ liệu
      const prepTime = parseInt(values.prepTime) || 0;
      const cookTime = parseInt(values.cookTime) || 0;
      const servings = parseInt(values.servings) || 0;
      const calories = parseInt(values.calories) || 0;

      // Kiểm tra và lọc dữ liệu
      const ingredients = values.ingredients
        .filter(
          (ing) =>
            ing.name &&
            ing.name.trim() !== "" &&
            ing.quantity &&
            ing.quantity.trim() !== ""
        )
        .map((ing) => ({
          name: ing.name.trim(),
          quantity: ing.quantity.trim(),
        }));

      const steps = values.steps
        .filter((step) => step && step.trim() !== "")
        .map((step) => step.trim());

      const tags = values.tags
        .filter((t) => t.tag && t.tag.trim() !== "")
        .map((t) => t.tag.trim());

      if (ingredients.length === 0) {
        throw new Error("Vui lòng nhập ít nhất một nguyên liệu");
      }

      if (steps.length === 0) {
        throw new Error("Vui lòng nhập ít nhất một bước thực hiện");
      }

      if (tags.length === 0) {
        throw new Error("Vui lòng nhập ít nhất một thẻ tag");
      }

      // Tạo recipe data
      const recipeData = {
        name: values.title.trim(),
        description: values.description.trim(),
        image: values.imageUrl ? values.imageUrl.trim() : null,
        prep_time: prepTime,
        cook_time: cookTime,
        total_time: prepTime + cookTime,
        servings: servings,
        ingredients: ingredients,
        steps: steps,
        calories: calories,
        tags: tags,
        rating: 0,
        nutrition: {
          protein: 0,
          fat: 0,
          carbs: 0,
        },
      };

      console.log("Dữ liệu gửi lên:", recipeData);

      const response = await api.post(endpoints.recipes.create, recipeData);
      if (response) {
        message.success("Thêm công thức thành công!");
        form.resetFields();
        onSuccess();
      }
    } catch (error) {
      if (error.message) {
        message.error(error.message);
      } else {
        message.error("Có lỗi xảy ra. Vui lòng thử lại.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Thêm Công Thức Mới"
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={720}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          ingredients: [{ id: Date.now(), name: "", quantity: "" }],
          steps: [""],
          tags: [{ id: Date.now(), tag: "" }],
        }}
      >
        <Form.Item
          name="title"
          label="Tên Công Thức"
          rules={[{ required: true, message: "Vui lòng nhập tên công thức" }]}
        >
          <Input placeholder="Nhập tên công thức" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Mô Tả"
          rules={[{ required: true, message: "Vui lòng nhập mô tả công thức" }]}
        >
          <TextArea rows={4} placeholder="Nhập mô tả công thức" />
        </Form.Item>

        <Form.List
          name="ingredients"
          rules={[
            {
              validator: async (_, ingredients) => {
                if (
                  !ingredients ||
                  ingredients.filter(
                    (ing) =>
                      ing.name.trim() !== "" && ing.quantity.trim() !== ""
                  ).length < 1
                ) {
                  return Promise.reject(
                    new Error("Cần ít nhất một nguyên liệu")
                  );
                }
              },
            },
          ]}
        >
          {(fields, { add, remove }, { errors }) => (
            <>
              <div style={{ marginBottom: 8 }}>
                <label style={{ marginBottom: 8, display: "block" }}>
                  Nguyên Liệu:
                </label>
                {fields.map((field, index) => (
                  <Space
                    key={field.key}
                    style={{ display: "flex", marginBottom: 8 }}
                    align="baseline"
                  >
                    <Form.Item
                      name={[field.name, "name"]}
                      fieldKey={[field.fieldKey, "name"]}
                      validateTrigger={["onChange", "onBlur"]}
                      rules={[
                        {
                          required: true,
                          whitespace: true,
                          message: "Vui lòng nhập tên nguyên liệu",
                        },
                      ]}
                      noStyle
                    >
                      <Input
                        placeholder="Tên nguyên liệu"
                        style={{ width: "200px" }}
                      />
                    </Form.Item>
                    <Form.Item
                      name={[field.name, "quantity"]}
                      fieldKey={[field.fieldKey, "quantity"]}
                      validateTrigger={["onChange", "onBlur"]}
                      rules={[
                        {
                          required: true,
                          whitespace: true,
                          message: "Vui lòng nhập số lượng",
                        },
                      ]}
                      noStyle
                    >
                      <Input
                        placeholder="Số lượng"
                        style={{ width: "150px" }}
                      />
                    </Form.Item>
                    {fields.length > 1 && (
                      <MinusCircleOutlined onClick={() => remove(field.name)} />
                    )}
                  </Space>
                ))}
                <Button
                  type="dashed"
                  onClick={() =>
                    add({ id: Date.now(), name: "", quantity: "" })
                  }
                  icon={<PlusOutlined />}
                  style={{ width: "200px" }}
                >
                  Thêm Nguyên Liệu
                </Button>
                <Form.ErrorList errors={errors} />
              </div>
            </>
          )}
        </Form.List>

        <Form.List
          name="steps"
          rules={[
            {
              validator: async (_, steps) => {
                if (
                  !steps ||
                  steps.filter((step) => step && step.trim() !== "").length < 1
                ) {
                  return Promise.reject(
                    new Error("Cần ít nhất một bước thực hiện")
                  );
                }
              },
            },
          ]}
        >
          {(fields, { add, remove }, { errors }) => (
            <>
              <div style={{ marginBottom: 8 }}>
                <label style={{ marginBottom: 8, display: "block" }}>
                  Các Bước Thực Hiện:
                </label>
                {fields.map((field, index) => (
                  <Space
                    key={field.key}
                    style={{ display: "flex", marginBottom: 8 }}
                    align="baseline"
                  >
                    <Form.Item
                      {...field}
                      validateTrigger={["onChange", "onBlur"]}
                      rules={[
                        {
                          required: true,
                          whitespace: true,
                          message:
                            "Vui lòng nhập nội dung bước thực hiện hoặc xóa trường này.",
                        },
                      ]}
                      noStyle
                    >
                      <Input.TextArea
                        placeholder={`Bước ${index + 1}`}
                        style={{ width: "500px" }}
                        autoSize={{ minRows: 1, maxRows: 3 }}
                      />
                    </Form.Item>
                    {fields.length > 1 && (
                      <MinusCircleOutlined onClick={() => remove(field.name)} />
                    )}
                  </Space>
                ))}
                <Button
                  type="dashed"
                  onClick={() => add("")}
                  icon={<PlusOutlined />}
                  style={{ width: "200px" }}
                >
                  Thêm Bước
                </Button>
                <Form.ErrorList errors={errors} />
              </div>
            </>
          )}
        </Form.List>

        <Form.Item
          name="prepTime"
          label="Thời Gian Chuẩn Bị (phút)"
          rules={[
            { required: true, message: "Vui lòng nhập thời gian chuẩn bị" },
          ]}
        >
          <Input type="number" placeholder="Nhập thời gian chuẩn bị (phút)" />
        </Form.Item>

        <Form.Item
          name="cookTime"
          label="Thời Gian Nấu (phút)"
          rules={[{ required: true, message: "Vui lòng nhập thời gian nấu" }]}
        >
          <Input type="number" placeholder="Nhập thời gian nấu (phút)" />
        </Form.Item>

        <Form.Item
          name="servings"
          label="Khẩu Phần"
          rules={[{ required: true, message: "Vui lòng nhập số khẩu phần" }]}
        >
          <Input type="number" placeholder="Nhập số khẩu phần" />
        </Form.Item>

        <Form.Item
          name="calories"
          label="Calories"
          rules={[{ required: true, message: "Vui lòng nhập số calories" }]}
        >
          <Input type="number" placeholder="Nhập số calories" />
        </Form.Item>

        <Form.List
          name="tags"
          rules={[
            {
              validator: async (_, tags) => {
                if (
                  !tags ||
                  tags.filter((tag) => tag.tag.trim() !== "").length < 1
                ) {
                  return Promise.reject(new Error("Cần ít nhất một thẻ tag"));
                }
              },
            },
          ]}
        >
          {(fields, { add, remove }, { errors }) => (
            <>
              <div style={{ marginBottom: 8 }}>
                <label style={{ marginBottom: 8, display: "block" }}>
                  Thẻ Tag:
                </label>
                {fields.map((field, index) => (
                  <Space
                    key={field.key}
                    style={{ display: "flex", marginBottom: 8 }}
                    align="baseline"
                  >
                    <Form.Item
                      name={[field.name, "tag"]}
                      fieldKey={[field.fieldKey, "tag"]}
                      validateTrigger={["onChange", "onBlur"]}
                      rules={[
                        {
                          required: true,
                          whitespace: true,
                          message: "Vui lòng nhập thẻ tag hoặc xóa trường này.",
                        },
                      ]}
                      noStyle
                    >
                      <Input
                        placeholder="Nhập thẻ tag"
                        style={{ width: "200px" }}
                      />
                    </Form.Item>
                    {fields.length > 1 && (
                      <MinusCircleOutlined onClick={() => remove(field.name)} />
                    )}
                  </Space>
                ))}
                <Button
                  type="dashed"
                  onClick={() => add({ id: Date.now(), tag: "" })}
                  icon={<PlusOutlined />}
                  style={{ width: "200px" }}
                >
                  Thêm Tag
                </Button>
                <Form.ErrorList errors={errors} />
              </div>
            </>
          )}
        </Form.List>

        <Form.Item
          name="imageUrl"
          label="Link Hình Ảnh"
          rules={[
            {
              type: "url",
              message: "Vui lòng nhập đúng định dạng URL",
            },
          ]}
        >
          <Input placeholder="Nhập link hình ảnh của công thức" />
        </Form.Item>

        <Form.Item>
          <div style={{ textAlign: "right", marginTop: 16 }}>
            <Button style={{ marginRight: 8 }} onClick={onCancel}>
              Hủy
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              disabled={loading}
            >
              {loading ? "Đang thêm..." : "Thêm Công Thức"}
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddRecipeModal;
