import React from 'react'
import Service from '../../utils/http';
import { Table, Button, Modal, Group, Pagination } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useState, useEffect } from 'react';
import { TextInput } from '@mantine/core';

const URLHistory = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const [updateData, setUpdateData] = React.useState({});
  const service = new Service();
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const handleUpdate = (element) => {
    open();
    setUpdateData(element);
    console.log(element);
  };

  const fetchHistory = async () => {
    try {
      const response = await service.get("user/my/urls");
      console.log(response.shortURLs);
      setData(response.shortURLs || []);
      setCurrentPage(1);
    } catch (error) {
      console.error("Error fetching URL history:", error);
    }
  };

  const handleDelete = async (id) => {
    const isConfirm = window.confirm("Are you sure you want to delete this URL?");
    if (!isConfirm) return;

    try {
      await service.delete("short-url/" + id);
      setData((prev) => prev.filter((item) => item._id !== id));
    } catch (error) {
      console.error("Error deleting URL:", error);
    }
  };

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = data.slice(startIndex, startIndex + itemsPerPage);

  const rows = paginatedData.map((element) => (
    <Table.Tr key={element._id}>
      <Table.Td>{element.originalUrl}</Table.Td>
      <Table.Td>{element.shortCode}</Table.Td>
      <Table.Td>{element.clickCount}</Table.Td>
      <Table.Td>{element.createdAt}</Table.Td>
      <Table.Td>{element.expiresAt}</Table.Td>
      <Table.Td>
        <Group gap="xs">
          <Button
            variant="filled"
            size="xs"
            radius="sm"
            onClick={() => handleUpdate(element)}
          >
            Edit
          </Button>

          <Button
            color="red"
            variant="filled"
            size="xs"
            radius="sm"
            onClick={() => handleDelete(element._id)}
          >
            Delete
          </Button>
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div>
      <Table highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Original URL</Table.Th>
            <Table.Th>Short URL</Table.Th>
            <Table.Th>Clicks</Table.Th>
            <Table.Th>Created At</Table.Th>
            <Table.Th>Expired At</Table.Th>
            <Table.Th>Action</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>

      {totalPages > 1 && (
        <Pagination
          mt="md"
          value={currentPage}
          onChange={setCurrentPage}
          total={totalPages}
        />
      )}

      <Modal opened={opened} onClose={close} title="Edit URL : ">
        <TextInput
          value={updateData.originalUrl || ""}
          label="Input label"
          withAsterisk
          description="Input description"
          placeholder="Input placeholder"
          onChange={(e) => setUpdateData({ ...updateData, originalUrl: e.target.value })}
        />
        <TextInput
          value={updateData.title || ""}
          label="Input label"
          withAsterisk
          description="Input description"
          placeholder="Input placeholder"
          onChange={(e) => setUpdateData({ ...updateData, title: e.target.value })}
        />
        <Button filled onClick={() => {}}>
          Update
        </Button>
      </Modal>
    </div>
  );
};

export default URLHistory;